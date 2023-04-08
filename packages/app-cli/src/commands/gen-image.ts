import { AiPlatformProviderManager } from "@sydekick/lib-ai-provider";
import { CreateImageRequestSizeEnum } from "openai";

import { Prompt } from "../Prompt.js";

export type GenImageOptions = {
  size?: CreateImageRequestSizeEnum;
  prompt: string;
  destfile?: string;
};

export async function genImage(options: GenImageOptions) {
  let { destfile } = options;
  const aiPlatformProviderManager = new AiPlatformProviderManager();
  const imageCreationProviderFactory =
    aiPlatformProviderManager.defaultImageCreationProviderFactory;
  const imageCreationProvider = await imageCreationProviderFactory.createProvider();

  if (!destfile) {
    const nameResponse = await Prompt.getRequiredInput("What should we name this image (_.png)?");
    destfile = nameResponse.endsWith(".png") ? nameResponse : `${nameResponse}.png`;
  }

  await imageCreationProvider.createImageFile(destfile, options);
}
