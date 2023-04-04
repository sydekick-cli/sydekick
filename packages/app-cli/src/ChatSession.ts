import { ChatCompletionRequestMessage, OpenAIApi } from "openai";
import { Api } from "./Api.js";
import { SYSTEM_PROGRAMMING_PROMPT_EXPECTED_RESPONSE } from "./constants.js";

export class ChatSession {
  private readonly _chatHistory: ChatCompletionRequestMessage[] = [];

  public get messages() {
    return this._chatHistory;
  }

  public chatAsAssistant(prompt: string) {
    this._chatHistory.push({
      role: "assistant",
      content: prompt,
    });
  }

  public chatAsUser(prompt: string) {
    this._chatHistory.push({
      role: "user",
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

    const programmingResponse: Awaited<ReturnType<OpenAIApi["createChatCompletion"]>> =
      await this.executeSession();

    // ensure the response is "yes"
    const programmingResponseContent =
      // @ts-ignore
      programmingResponse.data.choices[0].message.content;
    if (!SYSTEM_PROGRAMMING_PROMPT_EXPECTED_RESPONSE.test(programmingResponseContent)) {
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

  public async executeSession(): ReturnType<OpenAIApi["createChatCompletion"]> {
    const api = await Api.getInstance();
    let response: Awaited<ReturnType<OpenAIApi["createChatCompletion"]>>;
    try {
      response = await api.createChatCompletion({
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
