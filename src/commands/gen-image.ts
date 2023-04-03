import { CreateImageRequestSizeEnum } from "openai";
import { Api } from "../Api";
import { Prompt } from "../Prompt";
import * as http from "http";
import * as https from "https";
import * as fs from "fs";
import { dirname } from "path";

async function downloadImage(url: string, destfile: string): Promise<void> {
  const protocol = url.startsWith("https") ? https : http;
  try {
    const response = await protocol.get(url, (res) => {
      if (res.statusCode !== 200) {
        throw new Error(`Failed to download image: ${res.statusMessage}`);
      }

      const basedir = dirname(destfile);
      if (!fs.existsSync(basedir)) {
        fs.mkdirSync(basedir, { recursive: true });
      }

      // Create a writable stream to write the data to a local file
      const fileStream = fs.createWriteStream(destfile, { flags: "w", encoding: "binary" });

      // Pipe the response data to the file stream
      res.pipe(fileStream);

      // Wait for the file to finish writing
      fileStream.on("finish", () => {
        console.log("Image downloaded successfully!");
      });

      // Handle errors with the response and file stream
      res.on("error", (err) => console.error(`Failed to download image: ${err}`));
      fileStream.on("error", (err) => console.error(`Failed to write image to disk: ${err}`));
    });

    // Handle errors with the protocol request
    response.on("error", (err) => console.error(`Failed to download image: ${err}`));
  } catch (err) {
    console.error(`Failed to download image: ${err}`);
  }
}

export type GenImageOptions = {
  size?: CreateImageRequestSizeEnum;
  prompt: string;
  destfile?: string;
};

export async function genImage(options: GenImageOptions) {
  const { size, prompt } = options;
  let { destfile } = options;
  let imageResponse;
  try {
    imageResponse = await Api.instance.createImage({
      n: 1,
      prompt,
      size,
      response_format: "url",
    });
  } catch (error) {
    console.log(error);
    process.exit(1);
  }

  // download the image
  // example response:
  //   {
  //     "created": 1680558796,
  //     "data": [
  //       {
  //         "url": "https://oaidalleapiprodscus.blob.core.windows.net/private/org-wtTc47tPKE46tDTqLwI4R5TY/user-nhtHxSvsRTAdj3OiMmOrvDOF/img-De5TcAAWAyPpkeIKyq2v9A6Q.png?st=2023-04-03T20%3A53%3A16Z&se=2023-04-03T22%3A53%3A16Z&sp=r&sv=2021-08-06&sr=b&rscd=inline&rsct=image/png&skoid=6aaadede-4fb3-4698-a8f6-684d7786b067&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2023-04-03T20%3A21%3A44Z&ske=2023-04-04T20%3A21%3A44Z&sks=b&skv=2021-08-06&sig=A%2Btdz/dkWnzdjZkiLj0Gi5Nk6LCUSvTk5hrrTYFduNg%3D"
  //       }
  //     ]
  //   }
  // @ts-ignore
  const url = imageResponse.data.data[0].url;
  if (!url) {
    console.log("No image found");
    process.exit(1);
  }
  if (!destfile) {
    const nameResponse = await Prompt.getRequiredInput("What should we name this image (_.png)?");
    destfile = nameResponse.endsWith(".png") ? nameResponse : `${nameResponse}.png`;
  }
  try {
    await downloadImage(url, destfile);
    console.log(`Image downloaded to ${destfile}`);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
}
