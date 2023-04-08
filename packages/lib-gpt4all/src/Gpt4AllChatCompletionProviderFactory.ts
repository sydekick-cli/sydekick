import { IAiChatCompletionProviderFactory } from "@sydekick/lib-ai";

import { Gpt4AllChatCompletionProvider } from "./Gpt4AllChatCompletionProvider.js";

export class Gpt4AllChatCompletionProviderFactory
  implements IAiChatCompletionProviderFactory<Gpt4AllChatCompletionProvider>
{
  createProvider(): Promise<Gpt4AllChatCompletionProvider> {
    return Promise.resolve(new Gpt4AllChatCompletionProvider());
  }
}
