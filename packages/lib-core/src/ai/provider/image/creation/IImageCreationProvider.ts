import { Stream } from "stream";

export type ImageCreationOptions = {
  /**
   * The prompt to use to create the image.
   */
  prompt: string;
  /**
   * The size of the image to create. Currently the only sizes supported are 256x256, 512x512, and 1024x1024.
   */
  size?: string;
  /**
   * The number of images to create. Currently only 1 is supported.
   */
  n?: number;
};
export interface IImageCreationProvider {
  /**
   * Create an image and save it to a file.
   * @param path - The path to save the image to.
   * @param options - The options for creating the image.
   * @returns - a promise that resolves to the path of the image on disk.
   */
  createImageFile(path: string, options: ImageCreationOptions): Promise<string>;
  /**
   * Create an image and return it as a buffer.
   * @param options - The options for creating the image.
   * @returns - a promise that resolves to a stream of the image.
   */
  createImageStream(options: ImageCreationOptions): Promise<Stream>;
}
