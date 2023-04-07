import {
  IAiChatCompletionProvider,
  IAiCompletionProvider,
  IAiPlatformProvider,
  IAiProviderFactoryMetadata,
  IImageCreationProvider,
} from "@sydekick/lib-ai";

import { GPT4AllModelProvider } from "./Gpt4AllModelProvider.js";

export class GPT4AllPlatformProvider extends GPT4AllModelProvider implements IAiPlatformProvider {
  public readonly name: string = "gpt4all";
  public readonly description: string = "GPT4All Provider";

  get aiCompletionProviderFactoryMetadata():
    | IAiProviderFactoryMetadata<IAiCompletionProvider>
    | undefined {
    throw new Error("Method not implemented.");
  }
  get aiChatCompletionProviderFactoryMetadata():
    | IAiProviderFactoryMetadata<IAiChatCompletionProvider>
    | undefined {
    throw new Error("Method not implemented.");
  }
  get aiImageCreationProviderFactoryMetadata():
    | IAiProviderFactoryMetadata<IImageCreationProvider>
    | undefined {
    throw new Error("Method not implemented.");
  }

  initialize(): Promise<void> {
    return Promise.resolve();
  }
}
