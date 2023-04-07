import { ChatSession } from "@sydekick/lib-ai";
import { AiPlatformProviderManager } from "@sydekick/lib-ai-provider";

export const SYSTEM_PROGRAMMING_PROMPT = `
You are an assistant that is an expert at explaining shell commands in plain english.
The shell command will be provided to you by the user in the next message.
Please do your best to explain the command using sources in plain english and provide your most approximate estimation of 
what would occur if the command was executed including any side effects. If you are able to estimate the names of any processes
that would be executed, please do so. If you are able to estimate the names of any files that would be created, modified, or deleted, please do so.
At the very end of your response please append any notes you have any. Notes are not required but they are extremely helpful to the user and is highly recommended.
Also ensure to append the sources you used to explain the command. This is required please.

If you understand, please reply only with the exact phrase "yes".
`;

export async function explain(command: string) {
  console.log("Waking up sidekick...");
  const providerManager = new AiPlatformProviderManager();
  const chatCompletionProviderFactory = providerManager.defaultChatCompletionProviderFactory;
  const chatCompletionProvider = await chatCompletionProviderFactory.createProvider();
  const chatSession = new ChatSession(chatCompletionProvider);
  await chatSession.programChat(SYSTEM_PROGRAMMING_PROMPT);

  console.log("Let me think...");
  chatSession.chatAsRole("user", command);
  const response = await chatSession.executeSession();
  const responseContent =
    // @ts-ignore
    response.data.choices[0].message.content;

  console.log(responseContent);
}
