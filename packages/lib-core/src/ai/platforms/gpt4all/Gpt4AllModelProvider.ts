import debugLog from "debug";
import { resolve } from "path";
import { existsSync } from "fs";
import { homedir } from "os";
import { Gpt4AllProvider } from "./Gpt4AllProvider.js";
import { GPT4All } from "gpt4all";
import { rm } from "fs/promises";
import { IAiModelProvider } from "../../provider/IAiModelProvider.js";
import { IAiModelMetadata } from "../../IAiModelMetadata.js";

export abstract class GPT4AllModelProvider extends Gpt4AllProvider implements IAiModelProvider {
  // abstract member
  abstract initialize(): Promise<void>;

  public async install(model: string, force = false): Promise<boolean | undefined> {
    const debug = debugLog("@sydekick/lib-core:GPT4AllModelProvider::install");
    debug("Installing model: ", model);
    debug("Force: ", force);
    if (!force && this._isModelInstalled(model)) {
      debug(`Model ${model} is already installed.`);
      return undefined;
    }

    const modelPath = resolve(homedir(), ".nomic", `${model}.bin`);
    debug(`Installing model ${model} to ${modelPath}.`);
    console.log(`Installing model ${model}. This may take some time.`);
    try {
      const gpt4all = new GPT4All(model, force);
      await gpt4all.init(force);
    } catch (error) {
      debug(error);
      console.error(error);
      return false;
    }
    debug(`Model ${model} installed.`);
    console.log(`Model ${model} installed.`);
    return true;
  }

  public async uninstall(model: string): Promise<boolean | undefined> {
    const debug = debugLog("@sydekick/lib-core:GPT4AllModelProvider::uninstall");
    if (!this._isModelInstalled(model)) {
      debug(`Model ${model} is not installed.`);
      return undefined;
    }
    try {
      const modelPath = resolve(homedir(), ".nomic", `${model}.bin`);
      debug(`Uninstalling model ${model} from ${modelPath}.`);
      await rm(modelPath);
    } catch (error) {
      debug(error);
      console.error(error);
      return false;
    }
    debug(`Model ${model} uninstalled.`);
    console.log(`Model ${model} uninstalled.`);
    return true;
  }

  getAllModels(): Promise<IAiModelMetadata[]> {
    const debug = debugLog("@sydekick/lib-core:GPT4AllModelProvider::getAllModels");
    debug("Getting all models.");
    // const models: IAiModelMetadata[] = [
    //   {
    //     platform: {

    //     },
    //     enabled: false, // todo: implement
    //     installed: false, // todo: implement
    //     name: "gpt4all-lora-quantized",
    //     description: "",
    //   }
    // ];
    // return Promise.resolve(
    //   [
    //     {
    //       platform: {

    //       },
    //       name: "gpt4all-lora-quantized",
    //       description: "",
    //       installed: false,
    //       enabled: false,
    //     },
    //     {
    //       name: "gpt4all-lora-unfiltered-quantized",
    //       description: "",
    //       installed: false,
    //     },
    //   ].map((model) => {
    //     model.installed = this._isModelInstalled(model.name);
    //     return model;
    //   })
    // );
    // todo: this should be retrieved from the database.
    throw new Error("Method not implemented.");
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
    const debug = debugLog("@sydekick/lib-core:GPT4AllProvider::_isModelInstalled");
    debug(`Checking if model ${modelName} is installed.`);
    const modelPath = resolve(homedir(), ".nomic", `${modelName}.bin`);
    debug(`Checking if model exists at ${modelPath}.`);
    return existsSync(modelPath);
  }
}
