import { AiProvidable } from "./AiProvidable.js";

export interface IAiProviderFactory<ProviderType extends AiProvidable = AiProvidable> {
  /**
   * Create the provider.
   * @returns - a promise that resolves to the provider.
   */
  createProvider(): Promise<ProviderType>;
}
