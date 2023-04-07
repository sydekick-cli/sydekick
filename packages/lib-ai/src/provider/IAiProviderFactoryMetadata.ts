import { AiProvidable } from "./AiProvidable.js";
import { IAiProviderFactory } from "./IAiProviderFactory.js";

export interface IAiProviderFactoryMetadata<ProviderType extends AiProvidable> {
  /**
   * The id of the provider.
   */
  id: string;
  /**
   * The human-friendly name of the provider.
   */
  nameFriendly: string;
  /**
   * The description of the provider.
   */
  description: string;
  /**
   * The url of the provider.
   */
  url: string;
  /**
   * Whether or not the provider is built-in.
   */
  builtIn: boolean;
  /**
   * Whether or not the provider is enabled.
   */
  enabled: boolean;
  /**
   * Whether or not the provider is installed.
   */
  installed: boolean;
  /**
   * Whether or not the provider is the default.
   */
  default: boolean;
  /**
   * The factory for the provider.
   */
  factory: IAiProviderFactory<ProviderType>;
}
