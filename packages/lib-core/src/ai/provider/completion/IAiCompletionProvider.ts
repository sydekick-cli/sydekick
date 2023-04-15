import { IAiModelProvider } from "../IAiModelProvider.js";

export interface IAiCompletionProvider extends IAiModelProvider {
  /**
   * The name of the model to use for completion.
   */
  get completionModelName(): string;
  /**
   * Set the model to use for completion.
   * @param modelName - the name of the model to use for completion.
   */
  set completionModelName(modelName: string);

  /**
   * Execute a chat session and receive one or more responses
   * @param prompt - the prompt to use for completion.
   * @returns - a promise that resolves to the completed prompt.
   */
  executeCompletion(prompt: string): Promise<string>;
}
