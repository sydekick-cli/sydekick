import * as http from "http";
import * as https from "https";
import * as fs from "fs";
import { dirname } from "path";
import debugLog from "debug";
import { formatError } from "../error/formatError.js";

export function downloadImage(url: string, destfile: string): Promise<void> {
  const debug = debugLog("@sydekick/lib-core:downloadImage");
  debug(`Downloading image from ${url} to ${destfile}`);
  const protocol = url.startsWith("https") ? https : http;
  return new Promise((resolve, reject) => {
    try {
      const response = protocol.get(url, (res) => {
        if (res.statusCode !== 200) {
          debug(`Failed to download image:`, res);
          reject(new Error(`Failed to download image: ${res.statusMessage || ""}`));
        }

        const basedir = dirname(destfile);
        debug("Writing to directory", basedir);
        if (!fs.existsSync(basedir)) {
          debug("Creating directory", basedir);
          fs.mkdirSync(basedir, { recursive: true });
        }

        // Create a writable stream to write the data to a local file
        const fileStream = fs.createWriteStream(destfile, { flags: "w", encoding: "binary" });

        // Pipe the response data to the file stream
        res.pipe(fileStream);

        // Wait for the file to finish writing
        fileStream.on("finish", () => {
          fileStream.close();
          debug("Image downloaded successfully!");
          resolve();
        });

        // Handle errors with the response and file stream
        res.on("error", (err) => {
          debug(`Failed to download image: ${formatError(err)}`);
          reject(new Error(`Failed to download image: ${formatError(err)}`));
        });
        fileStream.on("error", (err) => {
          debug(`Failed to write image to disk: ${formatError(err)}`);
          reject(new Error(`Failed to write image to disk: ${formatError(err)}`));
        });
      });

      // Handle errors with the protocol request
      response.on("error", (err) => {
        debug(`Failed to download image: ${formatError(err)}`);
        reject(new Error(`Failed to download image: ${formatError(err)}`));
      });
    } catch (err) {
      debug(`Failed to download image: ${formatError(err)}`);
      reject(new Error(`Failed to download image: ${formatError(err)}`));
    }
  });
}
