import { IAiPlatform } from "../../provider/IAiPlatform.js";
import { IAiPlatformProvider } from "../../provider/IAiPlatformProvider.js";
import { IAiProviderFactoryMetadata } from "../../provider/IAiProviderFactoryMetadata.js";
import { IAiChatCompletionProvider } from "../../provider/chatCompletion/IAiChatCompletionProvider.js";
import { IAiCompletionProvider } from "../../provider/completion/IAiCompletionProvider.js";
import { IImageCreationProvider } from "../../provider/image/creation/IImageCreationProvider.js";
import { GPT4AllModelProvider } from "./Gpt4AllModelProvider.js";

export const Gpt4AllPlatform: IAiPlatform = {
  name: "gpt4all",
  description: "GPT4All Platform",
  builtin: true,
  enabled: true,
  installed: false,
  id: "gpt4all",
};

export class GPT4AllPlatformProvider extends GPT4AllModelProvider implements IAiPlatformProvider {
  // todo: these will be populated by the db
  public readonly id: string = "gpt4all";
  public readonly name: string = "gpt4all";
  public readonly description: string = "GPT4All Provider";
  public readonly builtin: boolean = true;
  public installed = false;
  public readonly enabled: boolean = true;

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
