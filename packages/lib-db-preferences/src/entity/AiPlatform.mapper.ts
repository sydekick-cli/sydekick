// aiPlatform.mapper.ts

import { IAiPlatform } from "@sydekick/lib-core";
import { AiPlatform } from "./AiPlatform.entity.js";

export class AiPlatformMapper {
  static toEntity(aiPlatform: IAiPlatform): AiPlatform {
    const entity = new AiPlatform();
    entity.id = aiPlatform.id;
    entity.name = aiPlatform.name;
    entity.description = aiPlatform.description;
    entity.builtin = aiPlatform.builtin;
    entity.installed = aiPlatform.installed;
    entity.enabled = aiPlatform.enabled;
    return entity;
  }

  static toInterface(aiPlatform: AiPlatform): IAiPlatform {
    return {
      id: aiPlatform.id,
      name: aiPlatform.name,
      description: aiPlatform.description,
      builtin: aiPlatform.builtin,
      installed: aiPlatform.installed,
      enabled: aiPlatform.enabled,
    };
  }
}
