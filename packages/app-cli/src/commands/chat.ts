import { ChatSession } from "@sydekick/lib-ai";
import { Prompt } from "../Prompt.js";
import { CliCommand } from "./CliCommand.js";
import { Command as CommanderCommand } from "commander";
import { AiPlatformProviderManager } from "@sydekick/lib-ai-provider";

export type ChatOptions = {
  previousSubject?: string;
  list?: boolean;
  delete?: string;
};

class CommandChatListSubjects extends CliCommand<undefined> {
  // api route:
  // GET /chat/subjects // list previous subjects (i.e 'sydekick chat list')

  protected _buildCommanderCommand(program: CommanderCommand): CommanderCommand {
    return program.command("list").description("List previous subjects");
  }
  public run(_options: undefined): Promise<void> {
    // todo: implement this
    // list all subjects
    // const subjects = db.prepare(`SELECT DISTINCT subject FROM chat_history`).all();
    // if (subjects.length > 0) {
    //   console.log("Previous subjects:");
    //   for (const subject of subjects) {
    //     console.log(subject.subject);
    //   }
    // } else {
    //   console.log("No previous subjects found");
    // }
    process.exit(0);
  }
  public parseArgs<T extends unknown[]>(..._args: T): undefined {
    return undefined;
  }
}

class CommandChatDeleteSubject extends CliCommand<{ subject: string }> {
  // api route:
  // DELETE /chat/subjects/:subject // delete a subject (i.e chat -d <subject>)
  protected _buildCommanderCommand(program: CommanderCommand): CommanderCommand {
    return program.command("delete <subject>").description("Delete a previous subject");
  }
  public run(_options: { subject: string }): Promise<void> {
    // todo: implement this
    // delete the subject
    // const result = db.prepare(`DELETE FROM chat_history WHERE subject = ?`).run(deleteSubject);
    // if (result.changes > 0) {
    //   console.log(`Deleted ${result.changes} messages for subject ${deleteSubject}`);
    // } else {
    //   console.log(`No messages found for subject ${deleteSubject}`);
    // }
    process.exit(0);
  }
  public parseArgs<T extends unknown[]>(...args: T): { subject: string } {
    return { subject: args[0] as string };
  }
}

async function initializeChatSession(): Promise<ChatSession> {
  const providerManager = new AiPlatformProviderManager();
  const chatCompletionProviderFactory = providerManager.defaultChatCompletionProviderFactory;
  const chatCompletionProvider = await chatCompletionProviderFactory.createProvider();
  // initialize the chatCompletionProvider
  await chatCompletionProvider.initialize();
  return new ChatSession(chatCompletionProvider);
}

async function commonChat(chatSession: ChatSession, _previousSubject?: string) {
  // start the chat session
  console.log("Starting chat session... Type 'exit' to exit.");
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const input = await Prompt.getRequiredInput("You: ");
    if (input === "exit") {
      // exit the chat session
      break;
    }

    // chat as the user
    chatSession.chatAsRole("user", input);

    // execute the chat session
    const response = await chatSession.executeSession();
    const responseContent = response[0].content;
    chatSession.chatAsRole("system", responseContent);
    console.log(`Sidekick: ${responseContent}`);
  }

  // todo: implement this
  // const subject = previousSubject || (await Prompt.getRequiredInput("Subject: "));
  // for (const message of chatSession.messages) {
  //   await saveChatHistory(subject, message.role, message.content);
  // }
}

class CommandChatNew extends CliCommand<{ subject?: string }> {
  protected _buildCommanderCommand(program: CommanderCommand): CommanderCommand {
    return program.command("new [subject]").description("Start a new chat session");
  }
  public async run(options: { subject?: string | undefined }): Promise<void> {
    const chatSession = await initializeChatSession();
    await commonChat(chatSession, options.subject);
  }
  public parseArgs<T extends unknown[]>(...args: T): { subject?: string | undefined } {
    return { subject: args[0] as string };
  }
}

class CommandChatResume extends CliCommand<{ subject: string }> {
  protected _buildCommanderCommand(program: CommanderCommand): CommanderCommand {
    return program.command("resume <subject>").description("Resume a previous chat session");
  }
  public async run(options: { subject: string }): Promise<void> {
    const chatSession = await initializeChatSession();
    // todo: implement this
    //   // attempt to load the previous chat history
    //   const previousMessages = db
    //     .prepare(`SELECT id, user, message, created_at FROM chat_history WHERE subject = ?`)
    //     .all(subject);
    //   if (previousMessages.length > 0) {
    //     console.log("Previous messages found:");
    //     // load the previous messages
    //     for (const message of previousMessages) {
    //       if (message.user === "system") {
    //         chatSession.chatAsRole("system", message.message);
    //         console.log(`Sidekick: ${message.message}`);
    //       } else {
    //         chatSession.chatAsRole("user", message.message);
    //         console.log(`You: ${message.message}`);
    //       }
    //     }
    //   } else {
    //     // no previous messages found
    //     console.log(`No previous messages found for subject ${subject}`);
    //     process.exit(1);
    //   }
    await commonChat(chatSession, options.subject);
  }
  public parseArgs<T extends unknown[]>(...args: T): { subject: string } {
    return { subject: args[0] as string };
  }
}

export class CommandChat extends CliCommand<undefined> {
  constructor() {
    super();
    this._subCommands.push(
      new CommandChatListSubjects(),
      new CommandChatDeleteSubject(),
      new CommandChatNew(),
      new CommandChatResume()
    );
  }

  protected _buildCommanderCommand(program: CommanderCommand): CommanderCommand {
    return program.command("chat").description("Sydekick chat");
    // api routes:
    // GET /chat // empty {} response
  }
  public run(_options: undefined): Promise<void> {
    this._commanderCommand?.outputHelp();
    return Promise.resolve();
  }

  public parseArgs<T extends unknown[]>(..._args: T): undefined {
    return undefined;
  }
}
