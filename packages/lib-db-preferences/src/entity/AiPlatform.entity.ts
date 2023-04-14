import { IAiPlatform } from "@sydekick/lib-core";
import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("ai_platforms")
export class AiPlatform implements IAiPlatform {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ unique: true })
  name: string;

  @Column()
  description: string;

  @Column({ default: false })
  builtin: boolean;

  @Column({ default: false })
  installed: boolean;

  @Column({ default: false })
  enabled: boolean;
}
