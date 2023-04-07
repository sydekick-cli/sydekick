import { IAiProviderFactory } from "@sydekick/lib-ai";

import { GPT4AllPlatformProvider } from "./Gpt4AllPlatformProvider.js";

export class Gpt4AllPlatformProviderFactory implements IAiProviderFactory<GPT4AllPlatformProvider> {
  get name(): string {
    return "gpt4all";
  }
  async createProvider(): Promise<GPT4AllPlatformProvider> {
    // No authentication needed for GPT4All
    // Return an instance of Gpt4AllProvider

    return new GPT4AllPlatformProvider();
  }
}
