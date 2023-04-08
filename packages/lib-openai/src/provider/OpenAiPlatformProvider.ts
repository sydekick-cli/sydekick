import {
  IAiChatCompletionProvider,
  IAiCompletionProvider,
  IAiPlatformProvider,
  IAiProviderFactoryMetadata,
  IImageCreationProvider,
} from "@sydekick/lib-ai";
import { OpenAiModelProvider } from "./OpenAiModelProvider.js";
import { OpenAiChatCompletionProviderFactory, OpenAiCompletionProviderFactory } from "./index.js";

export class OpenAiPlatformProvider extends OpenAiModelProvider implements IAiPlatformProvider {
  // todo: these will be populated by the db
  id: string = "openai";
  builtin: boolean = true;
  installed: boolean = true;
  enabled: boolean = true;

  get aiCompletionProviderFactoryMetadata():
    | IAiProviderFactoryMetadata<IAiCompletionProvider>
    | undefined {
    return {
      builtIn: true,
      default: true, // todo: get user default from db
      description: "OpenAI Completion Provider",
      enabled: true,
      id: "openai",
      factory: new OpenAiCompletionProviderFactory(),
      installed: true, // openai is always installed
      nameFriendly: "OpenAI",
      url: "https://platform.openai.com/docs/api-reference/completions/create",
    };
  }
  get aiChatCompletionProviderFactoryMetadata():
    | IAiProviderFactoryMetadata<IAiChatCompletionProvider>
    | undefined {
    return {
      builtIn: true,
      default: true, // todo: get user default from db
      description: "OpenAI Chat Completion Provider",
      enabled: true,
      id: "openai",
      factory: new OpenAiChatCompletionProviderFactory(),
      installed: true, // openai is always installed
      nameFriendly: "OpenAI Chat",
      url: "https://platform.openai.com/docs/api-reference/chat/create",
    };
  }
  get aiImageCreationProviderFactoryMetadata():
    | IAiProviderFactoryMetadata<IImageCreationProvider>
    | undefined {
    throw new Error("Method not implemented.");
  }
  public override initialize(): Promise<void> {
    return Promise.resolve();
  }
  public readonly name = "openai";
  public readonly description = "OpenAI Provider";
}
