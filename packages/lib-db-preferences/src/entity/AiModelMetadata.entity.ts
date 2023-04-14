import { IAiModelMetadata, IAiPlatform } from "@sydekick/lib-core";
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { AiPlatform } from "./AiPlatform.entity.js";

@Entity("ai_model_metadata")
export class AiModelMetadata implements IAiModelMetadata {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => AiPlatform, (aiPlatform) => aiPlatform.id, { eager: true })
  platform: IAiPlatform;

  @Column({ unique: true })
  name: string;

  @Column({ nullable: true, type: "varchar" })
  description?: string;

  @Column({ default: false })
  installed: boolean;

  @Column({ nullable: true, type: "varchar" })
  installationPath?: string | undefined;

  @Column({ default: false })
  enabled: boolean;
}
