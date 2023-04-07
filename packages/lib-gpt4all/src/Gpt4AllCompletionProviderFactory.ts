import { IAiCompletionProvider, IAiCompletionProviderFactory } from "@sydekick/lib-ai";

import { Gpt4AllCompletionProvider } from "./Gpt4AllCompletionProvider.js";
import { Gpt4AllProvider } from "./Gpt4AllProvider.js";

export class Gpt4AllCompletionProviderFactory
  extends Gpt4AllProvider
  implements IAiCompletionProviderFactory
{
  async createProvider(): Promise<IAiCompletionProvider> {
    return new Gpt4AllCompletionProvider();
  }
}
