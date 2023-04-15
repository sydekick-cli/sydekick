import { IAiModelMetadata } from "@sydekick/lib-core";
import { AiModelMetadata } from "./AiModelMetadata.entity.js";
import { AiPlatformMapper } from "./AiPlatform.mapper.js";

export class AiModelMetadataMapper {
  static toEntity(aiModelMetadata: IAiModelMetadata): AiModelMetadata {
    const entity = new AiModelMetadata();
    entity.platform = AiPlatformMapper.toEntity(aiModelMetadata.platform);
    entity.name = aiModelMetadata.name;
    entity.description = aiModelMetadata.description;
    entity.installed = aiModelMetadata.installed;
    entity.enabled = aiModelMetadata.enabled;
    return entity;
  }

  static toInterface(aiModelMetadata: AiModelMetadata): IAiModelMetadata {
    return {
      platform: AiPlatformMapper.toInterface(aiModelMetadata.platform),
      name: aiModelMetadata.name,
      description: aiModelMetadata.description,
      installed: aiModelMetadata.installed,
      enabled: aiModelMetadata.enabled,
    };
  }
}
