// @ts-ignore
import { getBrief } from "os-info";
import { ChatSession } from "../ChatSession";

export const SYSTEM_PROGRAMMING_PROMPT = `
You are a helpful assistant that suggests a list of shell commands the user can execute based on their objective.
The user will provide you with their objective and additional information such as their operating system and version,
the present working directory.

If you are unable to determine the commands to complete the objective, only reply with the following format:
Sorry, I am unable to determine the commands to complete the objective.

If you are able to determine the commands to complete the objective, reply with the following format:

Commands:
# step 1
# comment explaining command 1
# optional additional context for command 1
command 1
# step 2
# comment explaining command 2
# optional additional context for command 2
command 2
# step 3
# comment explaining command 3
# optional additional context for command 3
command 3
...

###############################################
# notes:
###############################################
#   note 1
#   ...

###############################################
# sources:
###############################################
#   source 1
#   ...
...

Please ensure that comments are explaining the purpose of the command that follows and are prefixed with a #.
Also please ensure that there are no special prefixes added to the commands such as item indicators or line numbers.
Also please ensure to append notes you have to the end of the response prepended with a #. Notes are not required but they are extremely helpful to the user and are highly recommended. Notes must be prepended with a #.
Also please ensure to append all sources you used to explain the command. Sources are required please as they are extremely helpful to the user. Sources must be prepended with a # and they must make a note of which steps they correlate to. Again, sources are required please.

Do not forget to include sources please.

If you understand, please reply only with the word "yes".
`;

export async function listCommands(objective: string) {
  console.log("Waking up sidekick...");

  const chatSession = new ChatSession();
  await chatSession.programChat(SYSTEM_PROGRAMMING_PROMPT);

  let additionalInfo = "";
  additionalInfo += `Operating System: ${getBrief().Platform}\n`;
  additionalInfo += `Present Working Directory: ${process.cwd()}\n`;
  chatSession.chatAsOtherRole(
    `This is my objective:\n${objective}\n\n${additionalInfo}Please reply in the format previously specified.`
  );

  console.log("Let me think...");

  const chatgptResponse = await chatSession.executeSession();

  let commands =
    // @ts-ignore
    chatgptResponse.data.choices[0].message.content.split("\n");

  // find the index of the header
  let headerIndex = -1;
  const header = "commands:";
  headerIndex = commands.findIndex((command: string) => {
    return command.toLowerCase().trim() === header;
  });
  if (headerIndex === -1) {
    commands.forEach((command: string) => {
      console.log(`    ${command}`);
    });
    process.exit(1);
  }
  commands = commands.slice(headerIndex + 1);
  console.log(`Okay, here's how you could '${objective}':\n`);
  commands.forEach((command: string) => {
    console.log(`    ${command}`);
  });
}
