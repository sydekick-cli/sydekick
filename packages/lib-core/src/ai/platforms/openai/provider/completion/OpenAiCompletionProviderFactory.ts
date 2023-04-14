import { OpenAiProviderFactory } from "../OpenAiProviderFactory.js";
import { OpenAiCompletionProvider } from "./OpenAiCompletionProvider.js";

export class OpenAiCompletionProviderFactory extends OpenAiProviderFactory<OpenAiCompletionProvider> {
  override async createProvider(): Promise<OpenAiCompletionProvider> {
    const openAiApi = await this._getOpenAiApi();
    return new OpenAiCompletionProvider(openAiApi);
  }
}
