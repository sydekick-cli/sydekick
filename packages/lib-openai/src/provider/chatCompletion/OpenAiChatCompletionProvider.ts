import { IAiChatCompletionProvider, IChatMessage } from "@sydekick/lib-ai";
import { OpenAiModelProvider } from "../OpenAiModelProvider.js";
import { ChatCompletionRequestMessageRoleEnum, OpenAIApi } from "openai";
import debugLog from "debug";

export class OpenAiChatCompletionProvider
  extends OpenAiModelProvider
  implements IAiChatCompletionProvider
{
  private _chatCompletionModelName = "gpt-3.5-turbo";

  constructor(_openai: OpenAIApi) {
    super(_openai);
  }

  get chatCompletionModelName(): string {
    return this._chatCompletionModelName;
  }
  set chatCompletionModelName(modelName: string) {
    // todo: validate model name
    this._chatCompletionModelName = modelName;
  }

  public async executeChatSession(chatMessages: IChatMessage[]): Promise<IChatMessage[]> {
    const debug = debugLog("@sydekick/lib-openai:OpenAiChatCompletionProvider::executeChatSession");
    let response: Awaited<ReturnType<OpenAIApi["createChatCompletion"]>>;
    try {
      response = await this._openai.createChatCompletion({
        model: this.chatCompletionModelName,
        messages: chatMessages.map((message) => ({
          content: message.content,
          role: message.role as ChatCompletionRequestMessageRoleEnum,
        })),
        n: 1, // todo: allow multiple responses
      });
    } catch (error) {
      debug("Error executing chat session.");
      console.error(error);
      process.exit(1);
    }
    const responseContent = response.data.choices[0].message?.content;
    if (!responseContent) {
      debug("Received empty response from OpenAI.");
      console.error(response);
      process.exit(1);
    }
    return response.data.choices.map((choice) => ({
      role: choice.message?.role || "system",
      content: choice.message?.content || "",
    }));
  }
}
