import { IAiModelMetadata } from "../IAiModelMetadata.js";

/**
 *  A model provider is a service that provides ai models.
 */
export interface IAiModelProvider {
  // todo: getInstalledModels(): Promise<IAiModelMetadata[]>;
  // todo: getUninstalledModels(): Promise<IAiModelMetadata[]>;
  // todo: getEnabledModels(): Promise<IAiModelMetadata[]>;
  // todo: getDisabledModels(): Promise<IAiModelMetadata[]>;
  /**
   * Get all models, including those that are not useable.
   */
  getAllModels(): Promise<IAiModelMetadata[]>;
  /**
   * Get all useable models.
   */
  getUseableModels(): Promise<IAiModelMetadata[]>;
  /**
   * Initialize the model provider.
   */
  initialize(): Promise<void>;
  /**
   * Install a model.
   * @param modelName - The name of the model to install.
   * @param force - Force install the model even if it is already installed.
   * @returns - A promise that resolves with:
   *  - true if the model was installed.
   * - false if the model failed to install.
   * - undefined if the model was already installed.
   */
  install(modelName: string, force?: boolean): Promise<boolean | undefined>;
  /**
   * Uninstall a model from the system.
   * @param modelName - The name of the model to uninstall.
   * @returns - A promise that resolves with:
   * - true if the model was uninstalled.
   * - false if the model failed to uninstall.
   * - undefined if the model was not installed.
   */
  uninstall(modelName: string): Promise<boolean | undefined>;
}
