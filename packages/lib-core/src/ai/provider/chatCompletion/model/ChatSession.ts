import { SYSTEM_PROGRAMMING_PROMPT_EXPECTED_RESPONSE } from "../../../constants.js";
import { IAiChatCompletionProvider } from "../IAiChatCompletionProvider.js";
import { IChatMessage } from "./IChatMessage.js";

// todo: need a typeorm type for this
// todo; need a mapper to map this to and from a db entity
export class ChatSession {
  private readonly _chatHistory: IChatMessage[] = [];

  constructor(private readonly _chatCompletionProvider: IAiChatCompletionProvider) {}

  public get messages() {
    return this._chatHistory;
  }

  public chatAsRole(role: string, message: string) {
    this._chatHistory.push({
      role,
      content: message,
    });
  }

  /**
   * Get the most recent message in the chat history.
   * @param role - the role of the author of the message to get. If not provided, the most recent message is returned.
   * @returns - the most recent message
   */
  public getMostRecentMessage(role?: string) {
    if (role) {
      return this._chatHistory
        .filter((message) => message.role === role)
        .slice(-1)
        .pop();
    }
    return this._chatHistory.slice(-1).pop();
  }

  public async programChat(prompt: string, systemRole = "system", _userRole = "user") {
    this.chatAsRole(systemRole, prompt);

    await this.executeSession();
    const programmingResponseContent = this.getMostRecentMessage(systemRole)?.content;
    // ensure that the response is a variation of "yes"
    if (
      !programmingResponseContent ||
      !SYSTEM_PROGRAMMING_PROMPT_EXPECTED_RESPONSE.test(programmingResponseContent)
    ) {
      console.error(
        `Expected the response to be a variation of "yes" but got "${
          programmingResponseContent ?? "undefined"
        }"`
      );
      process.exit(1);
    }
    // append the response to the chat history
    this.chatAsRole(systemRole, programmingResponseContent);
  }

  public async executeSession(): Promise<IChatMessage[]> {
    const response = await this._chatCompletionProvider.executeChatSession(this.messages);
    this._chatHistory.push(...response);
    return response;
  }
}
