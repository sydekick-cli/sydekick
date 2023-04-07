import { IAiModelProvider, IAiModelMetadata } from "@sydekick/lib-ai";
import debugLog from "debug";
import { resolve } from "path";
import { existsSync } from "fs";
import { homedir } from "os";
import { Gpt4AllProvider } from "./Gpt4AllProvider.js";

export abstract class GPT4AllModelProvider extends Gpt4AllProvider implements IAiModelProvider {
  // abstract member
  abstract initialize(): Promise<void>;

  getAllModels(): Promise<IAiModelMetadata[]> {
    return Promise.resolve(
      [
        {
          name: "gpt4all-lora-quantized",
          description: "",
          installed: false,
        },
        {
          name: "gpt4all-lora-unfiltered-quantized",
          description: "",
          installed: false,
        },
      ].map((model) => {
        model.installed = this._isModelInstalled(model.name);
        return model;
      })
    );
  }
  getUseableModels(): Promise<IAiModelMetadata[]> {
    return this.getAllModels();
  }

  /**
   * Check to see if the GPT4All model is installed locally.
   * @param modelName - the name of the model.
   * @returns - true if the model is installed, false otherwise.
   */
  private _isModelInstalled(modelName: string): boolean {
    const debug = debugLog("@sydekick/lib-gpt4all:GPT4AllProvider::_isModelInstalled");
    debug(`Checking if model ${modelName} is installed.`);
    const modelPath = resolve(homedir(), ".nomic", `${modelName}.bin`);
    debug(`Checking if model exists at ${modelPath}.`);
    return existsSync(modelPath);
  }
}
