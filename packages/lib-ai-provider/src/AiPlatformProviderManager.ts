import {
  IAiChatCompletionProviderFactory,
  IAiCompletionProviderFactory,
  IAiPlatformProvider,
  IAiProviderFactory,
  IAiProviderFactoryMetadata,
  IImageCreationProviderFactory,
} from "@sydekick/lib-ai";
import {
  Gpt4AllCompletionProviderFactory,
  GPT4AllPlatformProvider,
  Gpt4AllPlatformProviderFactory,
} from "@sydekick/lib-gpt4all";
import {
  OpenAiChatCompletionProviderFactory,
  OpenAiImageCreationProviderFactory,
  OpenAiPlatformProvider,
  OpenAiPlatformProviderFactory,
} from "@sydekick/lib-openai";
import debugLog from "debug";

const openAiPlatformProviderFactoryMetadata: IAiProviderFactoryMetadata<OpenAiPlatformProvider> = {
  id: "openai",
  nameFriendly: "OpenAI API",
  description: "OpenAI API",
  url: "https://openai.com/",
  builtIn: true, // openai is built-in
  enabled: true, // openai is enabled by default
  installed: true, // openai is always installed
  default: true, // openai is the default provider
  factory: new OpenAiPlatformProviderFactory(),
};
const gpt4AllPlatformProviderFactoryMetadata: IAiProviderFactoryMetadata<GPT4AllPlatformProvider> =
  {
    id: "gpt4all",
    nameFriendly: "GPT4All",
    description: "GPT4All",
    url: "https://github.com/nomic-ai/gpt4all",
    builtIn: true,
    enabled: true,
    installed: false, // todo: check if installed
    default: false,
    factory: new Gpt4AllPlatformProviderFactory(),
  };

export class AiPlatformProviderManager {
  public static readonly BUILT_IN_AI_PLATFORMS: {
    [key: string]: IAiProviderFactoryMetadata<IAiPlatformProvider>;
  } = {
    openai: openAiPlatformProviderFactoryMetadata,
    gpt4all: gpt4AllPlatformProviderFactoryMetadata,
  };

  // todo: need an init fn to async load all providers

  public get builtInAiPlatformProviders(): {
    [key: string]: IAiProviderFactoryMetadata<IAiPlatformProvider>;
  } {
    return AiPlatformProviderManager.BUILT_IN_AI_PLATFORMS;
  }

  public get defaultAiPlatformProviderFactory(): IAiProviderFactory<IAiPlatformProvider> {
    return this.builtInAiPlatformProviders.openai.factory;
  }

  public get defaultCompletionProviderFactory(): IAiCompletionProviderFactory {
    return new Gpt4AllCompletionProviderFactory();
  }

  public get defaultChatCompletionProviderFactory(): IAiChatCompletionProviderFactory {
    return new OpenAiChatCompletionProviderFactory();
  }

  public get defaultImageCreationProviderFactory(): IImageCreationProviderFactory {
    return new OpenAiImageCreationProviderFactory();
  }

  public getIsInstalled(id: string): Promise<boolean> {
    const debug = debugLog("@sydekick/lib-ai-provider:AiPlatformProviderManager::getIsInstalled");
    debug(`id: ${id}`);
    if (id === "openai") {
      debug(`returning true for openai`);
      return Promise.resolve(true);
    }
    const platform = this.builtInAiPlatformProviders[id];
    if (!platform) {
      throw new Error(`Unknown AI platform: ${id}`);
    }
    debug(`returning ${platform.installed ? "true" : "false"}`);
    return Promise.resolve(platform.installed);
  }

  public async installProvider(id: string, _force: boolean): Promise<void> {
    const providerMetadata = this.builtInAiPlatformProviders[id];
    if (!providerMetadata) {
      throw new Error(`Unknown AI platform: ${id}`);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const provider = await providerMetadata.factory.createProvider();
    // todo: provider.install(force);
  }
}
