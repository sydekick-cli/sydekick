import { ChatSession } from "../ChatSession";
import { Database } from "../Database";
import { Prompt } from "../Prompt";
import { Database as Db } from "better-sqlite3";

export type ChatOptions = {
  previousSubject?: string;
  list?: boolean;
  delete?: string;
};

export async function chat(options: ChatOptions) {
  const { previousSubject, list, delete: deleteSubject } = options;
  const db = Database.connection.db;
  // check to see if the chat_history table exists
  initializeChatHistoryTable(db);

  if (deleteSubject) {
    // delete the subject
    const result = db.prepare(`DELETE FROM chat_history WHERE subject = ?`).run(deleteSubject);
    if (result.changes > 0) {
      console.log(`Deleted ${result.changes} messages for subject ${deleteSubject}`);
    } else {
      console.log(`No messages found for subject ${deleteSubject}`);
    }
    process.exit(0);
  }

  if (list) {
    // list all subjects
    const subjects = db.prepare(`SELECT DISTINCT subject FROM chat_history`).all();
    if (subjects.length > 0) {
      console.log("Previous subjects:");
      for (const subject of subjects) {
        console.log(subject.subject);
      }
    } else {
      console.log("No previous subjects found");
    }
    process.exit(0);
  }

  const chatSession = new ChatSession();
  if (previousSubject) {
    // attempt to load the previous chat history
    const previousMessages = db
      .prepare(`SELECT id, user, message, created_at FROM chat_history WHERE subject = ?`)
      .all(previousSubject);
    if (previousMessages.length > 0) {
      console.log("Previous messages found:");
      // load the previous messages
      for (const message of previousMessages) {
        if (message.user === "system") {
          chatSession.chatAsSystem(message.message);
          console.log(`Sidekick: ${message.message}`);
        } else {
          chatSession.chatAsUser(message.message);
          console.log(`You: ${message.message}`);
        }
      }
    } else {
      // no previous messages found
      console.log(`No previous messages found for subject ${previousSubject}`);
      process.exit(1);
    }
  }

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
    chatSession.chatAsUser(input);

    // execute the chat session
    const response = await chatSession.executeSession();
    const responseContent =
      // @ts-ignore
      response.data.choices[0].message.content;
    chatSession.chatAsSystem(responseContent);
    console.log(`Sidekick: ${responseContent}`);
  }

  const subject = previousSubject || (await Prompt.getRequiredInput("Subject: "));
  for (const message of chatSession.messages) {
    await saveChatHistory(subject, message.role, message.content);
  }
}

function initializeChatHistoryTable(db: Db) {
  const chatHistoryTable = db
    .prepare(`SELECT name FROM sqlite_master WHERE type='table' AND name='chat_history'`)
    .get();
  if (!chatHistoryTable) {
    // initialize the chat_history table
    db.prepare(
      `CREATE TABLE chat_history (id INTEGER PRIMARY KEY AUTOINCREMENT, subject TEXT, message TEXT, user TEXT, created_at DATETIME DEFAULT CURRENT_TIMESTAMP)`
    ).run();
  }
}

async function saveChatHistory(subject: string, user: string, message: string) {
  const db = Database.connection.db;
  const existingMessage = db
    .prepare(`SELECT id FROM chat_history WHERE subject = ? AND user = ? AND message = ?`)
    .get(subject, user, message);

  if (!existingMessage) {
    db.prepare(`INSERT INTO chat_history (subject, user, message) VALUES (?, ?, ?)`).run(
      subject,
      user,
      message
    );
  }
}
