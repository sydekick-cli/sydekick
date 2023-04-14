import { CreateImageRequestSizeEnum, OpenAIApi } from "openai";
import { Stream } from "stream";
import debugLog from "debug";
import {
  IImageCreationProvider,
  ImageCreationOptions,
} from "../../../../provider/image/creation/IImageCreationProvider.js";
import { downloadImage } from "../../../../../util/downloadImage.js";

export class OpenAiImageCreationProvider implements IImageCreationProvider {
  constructor(private readonly _openai: OpenAIApi) {}

  public async createImageFile(path: string, options: ImageCreationOptions): Promise<string> {
    const debug = debugLog("@sydekick/lib-core:OpenAiImageCreationProvider::createImageFile");
    debug("Creating image file.");
    debug(`Path: ${path}`);
    debug(`Options: ${JSON.stringify(options)}`);
    let createImageRequest: Awaited<ReturnType<OpenAIApi["createImage"]>>;
    try {
      createImageRequest = await this._openai.createImage({
        prompt: options.prompt,
        size: options.size as CreateImageRequestSizeEnum | undefined,
        n: 1, // todo: support multiple images
      });
      debug("Created image file.");
      debug(JSON.stringify(createImageRequest));
    } catch (error) {
      debug("Error creating image file.");
      console.error(error);
      process.exit(1);
    }

    const url = createImageRequest.data.data[0].url;
    if (!url) {
      debug("No image URL returned.");
      console.error("No image URL returned.");
      process.exit(1);
    }
    debug(`Downloading image from ${url} to ${path}`);
    try {
      await downloadImage(url, path);
      debug("Downloaded image file.");
    } catch (error) {
      debug("Error downloading image file.");
      console.error(error);
      process.exit(1);
    }

    return path;
  }
  createImageStream(_options: ImageCreationOptions): Promise<Stream> {
    throw new Error("Method not implemented.");
  }
}
