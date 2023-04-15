import { IAiCompletionProviderFactory, IAiCompletionProvider } from "../../index.js";
import { Gpt4AllCompletionProvider } from "./Gpt4AllCompletionProvider.js";
import { Gpt4AllProvider } from "./Gpt4AllProvider.js";

export class Gpt4AllCompletionProviderFactory
  extends Gpt4AllProvider
  implements IAiCompletionProviderFactory
{
  createProvider(): Promise<IAiCompletionProvider> {
    return Promise.resolve(new Gpt4AllCompletionProvider());
  }
}
