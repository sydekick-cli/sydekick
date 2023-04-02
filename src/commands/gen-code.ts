import { ChatSession } from "../ChatSession";
import { Prompt } from "../Prompt";
import { readFile } from "fs/promises";

export const SYSTEM_PROGRAMMING_PROMPT = `
You are a helpful programmer who wants to help the user to solve a problem by writing a program.
In a moment, the user will describe the problem they are trying to solve.
The user may also ask you to write the program in a specific language. If they do not specify a language, you may choose one.
The user may also append existing code to their question. You should reference this code and ensure that your code works with it. Some of these files will be known as "editable reference files". You may edit these "editable reference files" to help you solve the problem. There are also "non-editable reference files". You may also reference "non-editable reference files", but you may not edit them.
If the user does append existing code, you should first attempt to solve the problem only by updating the "editable reference files" first and only writing new code files when it would not make sense to include the functionality in the "editable reference files". 
The user may also specify a destination file. If they do, you attempt to make all code changes in that file, but you may also fallback to "editable reference files" if necessary.
You are allowed to use any resources you would like to solve the problem. You may use the internet, books, or any other resources you would like. You are also allow to ask the user questions if you need more information to solve the problem.
You must also ensure that your code is not breaching any copyright laws or licenses. This is a must.
You are also strongly encouraged to comment your code to explain your thought process and how you solved the problem. This is helpful for the user to understand how you solved the problem and to learn from your code.

If you need to ask the user a question, do so in the following format:
Q: <question>

If you have all the information you need to solve the problem, you should write the code to solve the problem and respond with the following format described by the sections below:
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
    editableReferenceFiles?: string[];
    referenceFiles?: string[];
};

export async function genCode(options: GenCodeOptions) {
    let { objective, destfile, language, editableReferenceFiles, referenceFiles } = options;
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
    userMessage += "Please only respond in one of the formats initially described. If you do not, I will not be able to understand your response.\n\n";
    chatSession.chatAsOtherRole(userMessage);
    // console.log(chatSession);

    let finished = false;
    while (!finished) {
        const response = await chatSession.executeSession();
        console.log(response);
        if (response.data.choices[0].message?.content.toLowerCase().startsWith("q:")) {
            const question = response.data.choices[0].message?.content.slice(2).trim();
            console.log(question);
            const uResponse = await userResponse(" > ");
            chatSession.chatAsOtherRole(uResponse);
        } else if (response.data.choices[0].message?.content.toLowerCase().startsWith("sorry")) {
            console.error(response.data.choices[0].message?.content);
            process.exit(1);
        } else {
            // TODO: parse response
            console.log(response.data.choices[0].message?.content);
            finished = true;
        }
    }
}

async function userResponse(prompt: string): Promise<string> {
    const u = await Prompt.prompt(prompt, "");
    if (!u) {
        console.log("Please enter a response.");
        return await userResponse(prompt);
    }
    return u;
}

async function readFiles(files: string[]): Promise<{ path: string, contents: string }[]> {
    const filesData: { path: string, contents: string }[] = [];
    for (const file of files) {
        const content = await readFile(file, "utf-8");
        filesData.push({ path: file, contents: content });
    }
    return filesData;
}
