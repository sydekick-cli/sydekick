// todo: this should probably be a typeorm object
// todo: will need a mapper type to map from typeorm to and from this type

import { IAiPlatform } from "./IAiPlatform.js";
import { IAiProviderFactoryMetadata } from "./IAiProviderFactoryMetadata.js";
import {
  IAiChatCompletionProvider,
  IAiCompletionProvider,
  IImageCreationProvider,
} from "./index.js";

/**
 * An ai provider is a service that provides ai models.
 */
export interface IAiPlatformProvider extends IAiPlatform {
  /**
   * Get the ai completion provider factory metadata.
   * @returns - The ai completion provider factory metadata or undefined if the ai provider does not provide ai completion.
   */
  get aiCompletionProviderFactoryMetadata():
    | IAiProviderFactoryMetadata<IAiCompletionProvider>
    | undefined;
  /**
   * Get the ai chat completion provider factory metadata.
   * @returns - The ai chat completion provider factory metadata or undefined if the ai provider does not provide ai chat completion.
   */
  get aiChatCompletionProviderFactoryMetadata():
    | IAiProviderFactoryMetadata<IAiChatCompletionProvider>
    | undefined;
  /**
   * Get the ai image completion provider factory metadata.
   * @returns - The ai image completion provider factory metadata or undefined if the ai provider does not provide ai image completion.
   */
  get aiImageCreationProviderFactoryMetadata():
    | IAiProviderFactoryMetadata<IImageCreationProvider>
    | undefined;
}
