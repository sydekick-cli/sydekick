import { IAiModelProvider, IAiModelMetadata } from "@sydekick/lib-ai";
import { OpenAIApi } from "openai";
import debugLog from "debug";

export class OpenAiModelProvider implements IAiModelProvider {
  constructor(protected readonly _openai: OpenAIApi) {}
  install(_modelName: string, _force?: boolean | undefined): Promise<undefined> {
    return Promise.resolve(undefined); // openai models are always considered installed (aka available) since they are in the cloud
  }
  uninstall(_modelName: string): Promise<undefined> {
    return Promise.resolve(undefined); // openai models are always considered installed (aka available) since they are in the cloud so it can't be uninstalled
  }

  initialize(): Promise<void> {
    return Promise.resolve();
  }

  /**
   * Get all models.
   * @returns - a promise that resolves to an array of all models.
   */
  public async getAllModels(): Promise<IAiModelMetadata[]> {
    const debug = debugLog("@sydekick/lib-openai:ApiProvider::getAllModels");
    debug("Getting all OpenAI models.");
    let response: Awaited<ReturnType<OpenAIApi["listModels"]>>;
    try {
      response = await this._openai.listModels();
    } catch (error) {
      debug("Error getting models.");
      console.error(error);
      process.exit(1);
    }
    debug("Got all OpenAI models.");
    const models = response.data.data.map((model) => ({
      name: model.id,
      description: `${model.id} (owned by ${model.owned_by})`,
      installed: true, // openai models are always considered installed (aka available) since they are in the cloud
    }));
    debug(JSON.stringify(models));
    // return models;
    throw new Error("Method not implemented.");
  }

  /**
   * Get all models available to the user.
   * @returns - a promise that resolves to an array of all models available to the user.
   */
  public async getUseableModels(): Promise<IAiModelMetadata[]> {
    const debug = debugLog("@sydekick/lib-openai:ApiProvider::getUseableModels");
    debug("Getting all useable OpenAI models.");
    return this.getAllModels();
  }
}
