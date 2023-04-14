import { OpenAiChatCompletionProvider } from "./OpenAiChatCompletionProvider.js";
import { OpenAiProviderFactory } from "../OpenAiProviderFactory.js";
import { IAiChatCompletionProviderFactory } from "../../../../provider/chatCompletion/IAiChatCompletionProviderFactory.js";

export class OpenAiChatCompletionProviderFactory
  extends OpenAiProviderFactory<OpenAiChatCompletionProvider>
  implements IAiChatCompletionProviderFactory<OpenAiChatCompletionProvider>
{
  async createProvider(): Promise<OpenAiChatCompletionProvider> {
    const openaiApi = await this._getOpenAiApi();
    return new OpenAiChatCompletionProvider(openaiApi);
  }
}
