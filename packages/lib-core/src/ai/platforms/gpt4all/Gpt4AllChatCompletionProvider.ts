import debugLog from "debug";

import { GPT4AllModelProvider } from "./Gpt4AllModelProvider.js";
import { IAiChatCompletionProvider, IChatMessage } from "../../index.js";

export class Gpt4AllChatCompletionProvider
  extends GPT4AllModelProvider
  implements IAiChatCompletionProvider
{
  private _chatCompletionModelName = "gpt4all-lora-quantized";

  public get chatCompletionModelName(): string {
    return this._chatCompletionModelName;
  }
  public set chatCompletionModelName(modelName: string) {
    this._chatCompletionModelName = modelName;
  }

  public async executeChatSession(messages: IChatMessage[]): Promise<IChatMessage[]> {
    const debug = debugLog("@sydekick/lib-core:Gpt4AllChatCompletionProvider::executeChatSession");
    if (!this._gpt4all) {
      throw new Error("GPT4All is not initialized.");
    }
    // Open the connection with the model
    debug("Opening GPT4All connection.");
    await this._gpt4all.open();
    debug("GPT4All connection opened.");
    const newMessages = [];
    for (const message of messages) {
      const response = await this._gpt4all.prompt(`[user]: ${message.content}`);
      debug(`System response: ${response}`);
      newMessages.push({
        content: response,
        role: "system",
      });
    }

    // Close the connection when you're done
    this._gpt4all.close();
    return newMessages;
  }

  public async initialize(): Promise<void> {
    await this._initializeGpt4All(this._chatCompletionModelName);
  }
}
