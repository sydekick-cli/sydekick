import { IAiPlatform } from "./provider/IAiPlatform.js";

export interface IAiModelMetadata {
  platform: IAiPlatform;
  /**
   * The name of the model.
   */
  name: string;
  /**
   * A description of the model.
   */
  description?: string;
  /**
   * Whether the model is installed.
   */
  installed: boolean;
  /**
   * The path to the model installation.
   */
  installationPath?: string;
  /**
   * Whether the model is enabled.
   * If a model is not enabled, it will not be used.
   */
  enabled: boolean;
}
