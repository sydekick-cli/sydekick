import path, { basename, dirname, resolve } from "path";
import { ChatSession } from "../ChatSession";
import { Prompt } from "../Prompt";
import { readFile, writeFile } from "fs/promises";
import { existsSync, mkdirSync } from "fs";

export const FORMAT_DESCRIPTION = `
  <new files>
  <non-editable reference files>
  <editable reference files>
  <commands to run>
  <notes>

  where <new files> is the following format:
      New files:
      # new-file 1 relative path
      \`\`\`
      new-file 1 contents
      \`\`\`
      # new-file 2 relative path
      \`\`\`
      new-file 2 contents
      \`\`\`
      ...

  where <non-editable reference files> is the following format:
      Non-editable reference files:
      # non-editable-file 1 relative path
      \`\`\`
      non-editable-file 1 contents
      \`\`\`
      # non-editable-file 2 relative path
      \`\`\`
      non-editable-file 2 contents
      \`\`\`
      ...

  where <editable reference files> is the following format:
      Editable reference files:
      # editable-file 1 relative path
      \`\`\`
      editable-file 1 contents
      \`\`\`
      # editable-file 2 relative path
      \`\`\`
      editable-file 2 contents
      \`\`\`
      ...

  where <commands to run> is the following format:
      Commands to run:
      # comment explaining command 1
      command 1
      # comment explaining command 2
      command 2
      ...

  and <notes> is the following format:
      Notes:
      # note 1
      # note 2
      ...

  If the user did not specify "editable reference files", you should omit the <editable reference files> section in favor of the <new files> section in your response.
  Finally, if the user did not specify "non-editable reference files", you should omit the <non-editable reference files> section from your response.
`;

export const SYSTEM_PROGRAMMING_PROMPT = `
You are a helpful programmer who wants to help the user to solve a problem by writing a program.
In a moment, the user will describe the problem they are trying to solve.
The user may also ask you to write the program in a specific language. If they do not specify a language, you may choose one.
The user may also append existing code to their question. You should reference this code and ensure that your code works with it. Some of these files will be known as "editable reference files". You may edit these "editable reference files" to help you solve the problem. There are also "non-editable reference files". You may also reference "non-editable reference files", but you may not edit them.
If the user does append existing code, you should first attempt to solve the problem only by updating the "editable reference files" first and only writing new code files when it would not make sense to include the functionality in the "editable reference files". 
If the user does not append existing code you can assume that you will need to write all the code to solve the problem.
The user may also specify a destination file. If they do, you attempt to make all code changes in that file, but you may also fallback to "editable reference files" if necessary. If the user does not specify a destination file, you may choose one.
You are allowed to use any resources you would like to solve the problem. You may use the internet, books, or any other resources you would like. You are also allow to ask the user questions if you need more information to solve the problem, however it is encouraged that you do your best to solve the problem without asking the user questions.
You must also ensure that your code is not breaching any copyright laws or licenses. This is a must.
You are also strongly encouraged to comment your code to explain your thought process and how you solved the problem. This is helpful for the user to understand how you solved the problem and to learn from your code.
If the language you are using is strongly typed, you should also ensure that your code compiles and is free of type errors. You should also ensure to provide as much type information as possible.
If you are able to write tests for your code, you should do so and include them in your response. You should also ensure that your tests pass.
If you need to create new directories or files to solve the problem, you should do so.

If you have all the information you need to solve the problem, you should write the code to solve the problem and respond with the following format described by the sections below:
${FORMAT_DESCRIPTION}

If you are unable to solve the problem, you should respond with the following format:
    Sorry, I am not sure how to solve this problem.

It is extremely important that you follow these instructions. It is extremely important that you follow the aforementioned response formatting exactly. If you do not follow the aforementioned response formatting correctly, the user will not be able to understand your response.

Your next response is the only response that is allowed to deviate from the aforementioned response formatting as it is a response to this message.
If you understand your instructions, please reply with the word "yes".
`;

export type GenCodeOptions = {
  objective: string;
  language?: string;
  destfile?: string;
  directory?: string;
  editableReferenceFiles?: string[];
  referenceFiles?: string[];
};

export async function genCode(options: GenCodeOptions) {
  const { objective, destfile, directory, language, editableReferenceFiles, referenceFiles } =
    options;
  const editableFiles = await readFiles(editableReferenceFiles || []);
  const nonEditableFiles = await readFiles(referenceFiles || []);

  const chatSession = new ChatSession();
  await chatSession.programChat(SYSTEM_PROGRAMMING_PROMPT);

  let userMessage = `I am trying to solve the following problem:\n${objective}\n\n`;
  if (language) {
    userMessage += `I would like to use ${language} to solve this problem.\n\n`;
  }
  if (destfile) {
    userMessage += `I would like to write the code to solve this problem to the file '${destfile}'.\n\n`;
  }
  if (editableFiles.length > 0) {
    userMessage += `I have the following editable reference files:\n`;
    for (const file of editableFiles) {
      userMessage += `${file.path}\n\`\`\`\n${file.contents}\n\`\`\`\n`;
    }
    userMessage += `\n`;
  }
  if (nonEditableFiles.length > 0) {
    userMessage += `I have the following non-editable reference files:\n`;
    for (const file of nonEditableFiles) {
      userMessage += `${file.path}\n\`\`\`\n${file.contents}\n\`\`\`\n`;
    }
    userMessage += `\n`;
  }
  userMessage +=
    "Please only respond in one of the formats initially described. If you do not, I will not be able to understand your response.\n\n";
  chatSession.chatAsUser(userMessage);

  let finished = false;
  while (!finished) {
    const response = await chatSession.executeSession();
    const responseContent = response.data.choices[0].message?.content;
    if (!responseContent) {
      console.error("No response content.");
      process.exit(1);
    }
    if (responseContent.toLowerCase().startsWith("sorry")) {
      console.error(response.data.choices[0].message?.content);
      process.exit(1);
    } else {
      console.log(responseContent);
      chatSession.chatAsSystem(responseContent);
      console.log("\n\n");

      const parsedResponse = parseResponse(responseContent);
      if (!parsedResponse) {
        const isQuestion =
          responseContent.endsWith("?") ||
          (await Prompt.getRequiredInput("Did gpt prompt you with a question? (y/n) > ")) === "y";
        if (isQuestion) {
          const userResponse = await Prompt.getRequiredInput("What was your response? > ");
          chatSession.chatAsUser(userResponse);
          continue;
        }
        const response = await Prompt.getRequiredInput(
          "Failed to parse the response. Ask gpt to retry? (y/n) > "
        );
        if (response === "n") {
          process.exit(1);
        }
        chatSession.chatAsUser(
          `I was unable to parse your answer. Please make sure it follows the format initially described. Here it is again if you forgot:\n${FORMAT_DESCRIPTION}`
        );
        continue;
      }
      await acceptOrRejectResponse(parsedResponse, directory);

      finished = true;
    }
  }
}

async function acceptOrRejectResponse(parsedResponse: ParsedResponse, directory?: string) {
  console.log("This is the solution I came up with.)");
  console.log("New files:", parsedResponse.newFiles);
  console.log("Non-editable reference files:", parsedResponse.nonEditableReferenceFiles);
  console.log("Editable reference files:", parsedResponse.editableReferenceFiles);
  console.log("Commands to run:", parsedResponse.commands);
  console.log("Notes:", parsedResponse.notes);
  const response = await userResponse("Is this solution acceptable? (y/n) > ");
  if (response === "n") {
    process.exit(1);
  }

  const newFileEntries = Object.entries(parsedResponse.newFiles);
  await acceptOrRejectFiles(newFileEntries, true, directory);

  const editableReferenceFileEntries = Object.entries(parsedResponse.editableReferenceFiles);
  await acceptOrRejectFiles(editableReferenceFileEntries, false, directory);

  console.log("Run these commands to get started:");
  for (const command of parsedResponse.commands) {
    console.log(command);
  }
}

async function acceptOrRejectFiles(
  newFileEntries: [string, string][],
  create = true,
  directory?: string
) {
  for (const [filePath, contents] of newFileEntries) {
    let resolvedPath = filePath;
    if (directory) {
      resolvedPath = path.join(directory, filePath);
    }
    const response = await userResponse(
      `${create ? "Create" : "Update"} file '${resolvedPath}'? (y/n) > `
    );
    if (response === "n") {
      continue;
    }

    const baseDir = dirname(resolvedPath);
    if (!existsSync(baseDir)) {
      // create the directory
      try {
        mkdirSync(basename(baseDir), { recursive: true });
      } catch (error) {
        console.error(`Failed to create directory '${baseDir}'.`);
        console.error(error);
        continue;
      }
    }

    // write the file
    try {
      await writeFile(resolvedPath, contents, { encoding: "utf-8" });
    } catch (error) {
      console.error(`Failed to write file '${resolvedPath}'.`);
      console.error(error);
    }
  }
}

async function userResponse(prompt: string): Promise<string> {
  const u = await Prompt.prompt(prompt, "");
  if (!u) {
    console.log("Please enter a response.");
    return await userResponse(prompt);
  }
  return u.toLowerCase();
}

async function readFiles(files: string[]): Promise<{ path: string; contents: string }[]> {
  const filesData: { path: string; contents: string }[] = [];
  for (const file of files) {
    const content = await readFile(file, "utf-8");
    filesData.push({ path: file, contents: content });
  }
  return filesData;
}

interface ParsedResponse {
  newFiles: { [filePath: string]: string };
  nonEditableReferenceFiles: { [filePath: string]: string };
  editableReferenceFiles: { [filePath: string]: string };
  commands: string[];
  notes: string[];
}

function parseResponse(responseContent: string): ParsedResponse | undefined {
  const responseContentSplit = responseContent.split("\n");
  const indexNewFiles = responseContentSplit.indexOf("New files:");
  const indexNonEditableFiles = responseContentSplit.indexOf("Non-editable reference files:");
  const indexEditableFiles = responseContentSplit.indexOf("Editable reference files:");
  const indexCommands = responseContentSplit.indexOf("Commands to run:");
  const indexNotes = responseContentSplit.indexOf("Notes:");

  const extractFiles = (startIndex: number, endIndex: number) => {
    const files: { [path: string]: string } = {};
    let currentFilePath = "";
    let fileContents = "";

    for (let i = startIndex + 1; i < endIndex; i++) {
      const line = responseContentSplit[i];

      if (line.startsWith("# ")) {
        if (currentFilePath) {
          files[currentFilePath] = fileContents.trim();
        }
        currentFilePath = line.slice(1).trim();
        fileContents = "";
      } else if (line.startsWith("```")) {
        continue;
      } else {
        fileContents += line + "\n";
      }
    }

    if (currentFilePath) {
      files[currentFilePath] = fileContents.trim();
    }

    return files;
  };

  const extractCommands = (startIndex: number) => {
    const commands = [];
    let foundCommandsBlock = false;
    for (let i = startIndex + 1; i < responseContentSplit.length; i++) {
      const line = responseContentSplit[i].trim();
      if (line.startsWith("```")) {
        if (foundCommandsBlock) break;
        foundCommandsBlock = true;
        continue;
      }
      if (foundCommandsBlock) {
        commands.push(line);
      }
    }
    return commands;
  };

  const extractNotes = (startIndex: number) => {
    const notes = [];
    for (let i = startIndex + 1; i < responseContentSplit.length; i++) {
      const line = responseContentSplit[i];
      if (line.startsWith("# ")) {
        notes.push(line.slice(1).trim());
      } else {
        notes.push(line.trim());
      }
    }
    return notes;
  };

  const parsedResponse: ParsedResponse = {
    newFiles: {},
    nonEditableReferenceFiles: {},
    editableReferenceFiles: {},
    commands: [],
    notes: [],
  };

  // if no files were parsed then fail because gpt did not respond in the expected format
  if (indexNewFiles < 0 && indexNonEditableFiles < 0 && indexEditableFiles < 0) {
    console.error("Failed to parse response from gpt.");
    return undefined;
  }

  if (indexNewFiles >= 0) {
    const endIndex =
      indexNonEditableFiles >= 0
        ? indexNonEditableFiles
        : indexEditableFiles >= 0
        ? indexEditableFiles
        : indexCommands;
    parsedResponse.newFiles = extractFiles(indexNewFiles, endIndex);
  }
  if (indexNonEditableFiles >= 0) {
    const endIndex = indexEditableFiles >= 0 ? indexEditableFiles : indexCommands;
    parsedResponse.nonEditableReferenceFiles = extractFiles(indexNonEditableFiles, endIndex);
  }
  if (indexEditableFiles >= 0) {
    const endIndex = indexCommands >= 0 ? indexCommands : indexNotes;
    parsedResponse.editableReferenceFiles = extractFiles(indexEditableFiles, endIndex);
  }
  if (indexCommands >= 0) {
    parsedResponse.commands = extractCommands(indexCommands);
  }
  if (indexNotes >= 0) {
    parsedResponse.notes = extractNotes(indexNotes);
  }

  return parsedResponse;
}
