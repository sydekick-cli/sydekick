import { IAiModelProvider } from "../IAiModelProvider.js";
import { IChatMessage } from "./model/IChatMessage.js";

export interface IAiChatCompletionProvider extends IAiModelProvider {
  /**
   * The name of the model to use for chat completion.
   */
  get chatCompletionModelName(): string;
  /**
   * Set the model to use for chat completion.
   * @param modelName - the name of the model to use for chat completion.
   */
  set chatCompletionModelName(modelName: string);

  /**
   * Execute a chat session and receive one or more responses
   * @param messages - the most recent responses in the chat session.
   * @returns - a promise that resolves to the responses from the chat session.
   */
  executeChatSession(messages: IChatMessage[]): Promise<IChatMessage[]>;
}
