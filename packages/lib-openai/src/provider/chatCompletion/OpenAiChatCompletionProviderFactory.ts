import { IAiChatCompletionProviderFactory } from "@sydekick/lib-ai";
import { OpenAiChatCompletionProvider } from "./OpenAiChatCompletionProvider.js";
import { OpenAiProviderFactory } from "../OpenAiProviderFactory.js";

export class OpenAiChatCompletionProviderFactory
  extends OpenAiProviderFactory<OpenAiChatCompletionProvider>
  implements IAiChatCompletionProviderFactory<OpenAiChatCompletionProvider>
{
  async createProvider(): Promise<OpenAiChatCompletionProvider> {
    const openaiApi = await this._getOpenAiApi();
    return new OpenAiChatCompletionProvider(openaiApi);
  }
}
