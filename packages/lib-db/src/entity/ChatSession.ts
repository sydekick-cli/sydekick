// import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
// import { ChatMessage } from "./ChatMessage";

// @Entity()
// export class ChatSession {
//   @PrimaryGeneratedColumn("uuid")
//   id: string;

//   @Column()
//   name: string;

//   @Column({ nullable: true })
//   description?: string;

//   @OneToMany(() => ChatMessage, (chatMessage) => chatMessage.session)
//   messages: ChatMessage[];

//   @Column({ type: "datetime" })
//   createdAt: Date;

//   constructor(name: string, description?: string, messages?: ChatMessage[]) {
//     this.id = "";
//     this.name = name;
//     this.messages = messages || [];
//     this.description = description;
//     this.createdAt = new Date();
//   }
// }
