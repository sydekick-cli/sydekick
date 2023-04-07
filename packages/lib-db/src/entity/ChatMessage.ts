// // ChatMessage.ts
// import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToOne } from "typeorm";
// import { ChatSession } from "./ChatSession";
// import { ChatSessionHistory } from "./ChatSessionHistory";

// @Entity()
// export class ChatMessage {
//   @PrimaryGeneratedColumn("uuid")
//   id: string;

//   @ManyToOne(() => ChatSession, (chatSession) => chatSession.messages)
//   session: ChatSession;

//   @OneToOne(() => ChatSessionHistory, (chatSessionHistory) => chatSessionHistory.message)
//   chatSessionHistory: ChatSessionHistory;

//   @Column()
//   role: string;

//   @Column({ nullable: true })
//   name?: string;

//   @Column()
//   content: string;

//   @Column({ type: "datetime" })
//   createdAt: Date;
// }
