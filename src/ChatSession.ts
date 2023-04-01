import { ChatCompletionRequestMessage, ChatCompletionRequestMessageRoleEnum, OpenAIApi } from "openai";
import { Api } from "./Api";
import { SYSTEM_PROGRAMMING_PROMPT_EXPECTED_RESPONSE } from "./constants";

export class ChatSession {
  private readonly _chatHistory: ChatCompletionRequestMessage[] = [];

  constructor(private readonly _otherRole: ChatCompletionRequestMessageRoleEnum = "user") {}

    public chatAsOtherRole(prompt: string) {
        this._chatHistory.push({
            role: this._otherRole,
            content: prompt,
        });
    }

    public chatAsSystem(prompt: string) {
        this._chatHistory.push({
            role: "system",
            content: prompt,
        });
    }

  public async programChat(prompt: string) {
    this._chatHistory.push({
      role: "system",
      content: prompt,
    });

    let programmingResponse: Awaited<
      ReturnType<OpenAIApi["createChatCompletion"]>
    > = await this.executeSession();

    // ensure the response is "yes"
    const programmingResponseContent =
      // @ts-ignore
      programmingResponse.data.choices[0].message.content;
    if (
      !SYSTEM_PROGRAMMING_PROMPT_EXPECTED_RESPONSE.test(programmingResponseContent)
    ) {
      console.error(
        `Expected the response to be a variation of "yes" but got "${programmingResponseContent}"`
      );
      process.exit(1);
    }
    // append the response to the chat history
    this._chatHistory.push({
      role: "system",
      content: programmingResponseContent,
    });
  }

  public async executeSession() {
    let response: Awaited<
      ReturnType<OpenAIApi["createChatCompletion"]>
    >;
    try {
      response = await Api.instance.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: this._chatHistory,
        n: 1, // Number of responses generated
      });
    } catch (error) {
      console.error("Error: ", error);
      process.exit(1);
    }
    return response;
  }
}
