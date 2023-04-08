import { IAiCompletionProvider } from "@sydekick/lib-ai";
import debugLog from "debug";
import { OpenAIApi } from "openai";

import { OpenAiModelProvider } from "../OpenAiModelProvider.js";
import { formatError } from "@sydekick/lib-util";

export class OpenAiCompletionProvider extends OpenAiModelProvider implements IAiCompletionProvider {
  private _chatCompletionModelName = "gpt-3.5-turbo";
  get completionModelName(): string {
    return this._chatCompletionModelName;
  }
  set completionModelName(modelName: string) {
    this._chatCompletionModelName = modelName;
  }
  public async executeCompletion(prompt: string): Promise<string> {
    const debug = debugLog("@sydekick/lib-openai:OpenAiCompletionProvider::executeCompletion");
    debug(`Executing completion with prompt: ${prompt}`);
    let response: Awaited<ReturnType<OpenAIApi["createCompletion"]>>;
    try {
      response = await this._openai.createCompletion({
        model: this._chatCompletionModelName,
        prompt,
      });
      debug(`Completion response: ${JSON.stringify(response)}`);
    } catch (error) {
      throw new Error(`OpenAI Completion Error: ${formatError(error)}`);
    }
    const responseText = response.data.choices[0].text;
    debug(`Completion response text: ${responseText || ""}`);
    return responseText || "";
  }
}
