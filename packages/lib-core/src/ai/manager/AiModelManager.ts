import { IAiModelMetadata } from "../IAiModelMetadata.js";
import { AiPlatformProviderManager } from "./AiPlatformProviderManager.js";

/**
 * The AiModelManager class provides facilities for managing the AI models used by the application.
 * These facilities include:
 * - Listing models (all, enabled, disabled, installed)
 * - Installing models
 * - Uninstalling models
 * - Enabling models
 * - Disabling models
 * // todo: checking for updates
 * // todo: updating models
 */
export class AiModelManager {
  private readonly _models: IAiModelMetadata[] = [];
  private readonly _aiPlatformProviderManager: AiPlatformProviderManager =
    new AiPlatformProviderManager();

  /**
   * Lists all models.
   */
  public async listModels(): Promise<void> {
    // todo: use updatable list
    const providersMetadata = this._aiPlatformProviderManager.builtInAiPlatformProviders;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    for (const [_name, providerMetadata] of Object.entries(providersMetadata).filter(
      (p) => p[1].installed && p[1].enabled
    )) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const _provider = await providerMetadata.factory.createProvider();
      // const models = provider.
      // for (const model of models) {
      //   this._models.push(model);
      // }
    }
  }
}
