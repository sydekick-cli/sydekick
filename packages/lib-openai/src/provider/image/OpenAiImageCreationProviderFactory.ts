import { IImageCreationProviderFactory } from "@sydekick/lib-ai";

import { OpenAiProviderFactory } from "../OpenAiProviderFactory.js";
import { OpenAiImageCreationProvider } from "./OpenAiImageCreationProvider.js";

export class OpenAiImageCreationProviderFactory
  extends OpenAiProviderFactory<OpenAiImageCreationProvider>
  implements IImageCreationProviderFactory
{
  public async createProvider(): Promise<OpenAiImageCreationProvider> {
    const openaiApi = await this._getOpenAiApi();
    return new OpenAiImageCreationProvider(openaiApi);
  }
}
