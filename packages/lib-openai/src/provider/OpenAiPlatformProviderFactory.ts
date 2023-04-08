import { OpenAiPlatformProvider } from "./OpenAiPlatformProvider.js";
import { OpenAiProviderFactory } from "./OpenAiProviderFactory.js";

// OpenAI AiProviderFactory
export class OpenAiPlatformProviderFactory extends OpenAiProviderFactory<OpenAiPlatformProvider> {
  public async createProvider(): Promise<OpenAiPlatformProvider> {
    const openaiApi = await this._getOpenAiApi();
    return new OpenAiPlatformProvider(openaiApi);
  }
}
