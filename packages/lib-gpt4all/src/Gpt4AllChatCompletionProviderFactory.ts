import { IAiChatCompletionProviderFactory } from "@sydekick/lib-ai";

import { Gpt4AllChatCompletionProvider } from "./Gpt4AllChatCompletionProvider.js";

export class Gpt4AllChatCompletionProviderFactory
  implements IAiChatCompletionProviderFactory<Gpt4AllChatCompletionProvider>
{
  async createProvider(): Promise<Gpt4AllChatCompletionProvider> {
    return new Gpt4AllChatCompletionProvider();
  }
}
