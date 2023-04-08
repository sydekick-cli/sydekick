import "reflect-metadata";
import { DataSource } from "typeorm";
// import { ChatMessage } from "./entity";
// import { ChatSession } from "./entity";
// import { ChatSessionHistory } from "./entity";

// export const AppDataSource = new DataSource({
//     type: "postgres",
//     host: "localhost",
//     port: 5432,
//     username: "test",
//     password: "test",
//     database: "test",
//     synchronize: true,
//     logging: false,
//     entities: [User],
//     migrations: [],
//     subscribers: [],
// })

export const AppDataSource = new DataSource({
  type: "sqlite",
  database: "test.sqlite3",
  // entities: [ChatMessage, ChatSession, ChatSessionHistory],
  synchronize: true,
  logging: false,
});
