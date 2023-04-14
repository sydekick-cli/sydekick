import { GPT4All } from "gpt4all";
import debugLog from "debug";

export class Gpt4AllProvider {
  protected _gpt4all?: GPT4All;

  /**
   * Initialize the GPT4All model.
   */
  protected async _initializeGpt4All(modelName: string): Promise<void> {
    const debug = debugLog("@sydekick/lib-core:Gpt4AllChatCompletionProvider::initialize");
    // Instantiate GPT4All with default or custom settings
    this._gpt4all = new GPT4All(modelName, false); // Default is 'gpt4all-lora-quantized' model
    debug(`Using model ${modelName}.`);

    // Initialize and download missing files
    debug("Initializing GPT4All.");
    await this._gpt4all.init();
    debug("GPT4All initialized.");
    // debug("Initializing roles.");
    // const systemResponse = await this._gpt4all.prompt(
    //   "[user]: You are known as [system]. I am known as [user]. You shall always reply to me in the format '[system]: <message>'. I will always reply to you in the format of '[user]: <message>'. If you understand, reply '[system]: yes'."
    // );
    // debug(`System response: ${systemResponse}`);
    // if (!systemResponse.toLowerCase().includes("yes")) {
    //   throw new Error("Failed to initialize roles.");
    // } else {
    //   debug("Roles initialized.");
    // }
  }
}
