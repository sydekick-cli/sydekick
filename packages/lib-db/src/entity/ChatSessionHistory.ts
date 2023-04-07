// import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from "typeorm";
// import { ChatMessage } from "./ChatMessage";

// @Entity()
// export class ChatSessionHistory {
//   @PrimaryGeneratedColumn("uuid")
//   id: string;

//   @Column()
//   name: string;

//   @Column({ nullable: true })
//   description?: string;

//   @Column({ type: "datetime" })
//   createdAt: Date;

//   constructor(name: string, description?: string, message?: ChatMessage) {
//     this.id = "";
//     this.name = name;
//     this.message = message;
//     this.description = description;
//     this.createdAt = new Date();
//   }

// }
