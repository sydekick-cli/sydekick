import { AiProvidable, IAiProviderFactory } from "@sydekick/lib-ai";
import { Configuration, OpenAIApi } from "openai";
import { OpenAIApiKeystore } from "../OpenAIApiKeystore.js";

export abstract class OpenAiProviderFactory<Providable extends AiProvidable>
  implements IAiProviderFactory<Providable>
{
  protected async _getOpenAiApi(): Promise<OpenAIApi> {
    const apiKey = await new OpenAIApiKeystore().getApiKey();
    if (!apiKey) {
      throw new Error(
        "OpenAI API key not set. Please login with 'sydekick provider initialize openai'."
      );
    }
    return new OpenAIApi(new Configuration({ apiKey }));
  }

  abstract createProvider(): Promise<Providable>;
}
