import debugLog from "debug";

import { GPT4AllModelProvider } from "./Gpt4AllModelProvider.js";
import { IAiCompletionProvider } from "../../provider/completion/IAiCompletionProvider.js";

export class Gpt4AllCompletionProvider
  extends GPT4AllModelProvider
  implements IAiCompletionProvider
{
  private _chatCompletionModelName = "gpt4all-lora-quantized";

  get completionModelName(): string {
    return this._chatCompletionModelName;
  }
  set completionModelName(modelName: string) {
    this._chatCompletionModelName = modelName;
  }

  public async executeCompletion(prompt: string): Promise<string> {
    const debug = debugLog("@sydekick/lib-core:Gpt4AllChatCompletionProvider::executeChatSession");
    debug(`Prompt: ${prompt}`);
    if (!this._gpt4all) {
      debug("GPT4All is not initialized.");
      throw new Error("GPT4All is not initialized.");
    }
    debug("Opening GPT4All connection.");
    await this._gpt4all.open();
    debug("GPT4All connection opened.");
    const response = await this._gpt4all.prompt(prompt);
    debug(`System response: ${response}`);
    this._gpt4all.close();
    return response;
  }

  async initialize(): Promise<void> {
    await this._initializeGpt4All(this._chatCompletionModelName);
  }
}
