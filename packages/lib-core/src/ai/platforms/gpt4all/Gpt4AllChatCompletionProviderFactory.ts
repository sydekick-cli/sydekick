import { IAiChatCompletionProviderFactory } from "../../provider/chatCompletion/IAiChatCompletionProviderFactory.js";
import { Gpt4AllChatCompletionProvider } from "./Gpt4AllChatCompletionProvider.js";

export class Gpt4AllChatCompletionProviderFactory
  implements IAiChatCompletionProviderFactory<Gpt4AllChatCompletionProvider>
{
  createProvider(): Promise<Gpt4AllChatCompletionProvider> {
    return Promise.resolve(new Gpt4AllChatCompletionProvider());
  }
}
