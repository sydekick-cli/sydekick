import { IAiProviderFactory } from "../../provider/IAiProviderFactory.js";
import { GPT4AllPlatformProvider } from "./Gpt4AllPlatformProvider.js";

export class Gpt4AllPlatformProviderFactory implements IAiProviderFactory<GPT4AllPlatformProvider> {
  get name(): string {
    return "gpt4all";
  }
  createProvider(): Promise<GPT4AllPlatformProvider> {
    // No authentication needed for GPT4All
    // Return an instance of Gpt4AllProvider

    return Promise.resolve(new GPT4AllPlatformProvider());
  }
}
