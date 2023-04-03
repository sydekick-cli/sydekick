#!/usr/bin/env node
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

import { Command } from "commander";

import { listCommands } from "./commands/list-commands.js";
import { explain } from "./commands/explain.js";
import { genCode } from "./commands/gen-code.js";
import { chat } from "./commands/chat.js";
import { genImage } from "./commands/gen-image.js";
import fs from "fs/promises";
import { signIn } from "./commands/sign-in.js";
import { signOut } from "./commands/sign-out.js";

async function readPackageJson() {
  const fileContent = await fs.readFile(resolve(__dirname, "../", "./package.json"), "utf-8");
  const packageJson = JSON.parse(fileContent);
  return packageJson;
}

void readPackageJson().then((packageJson) => {
  const program = new Command();
  program.description("Assists with CLI commands using ChatGPT").version(packageJson.version);

  program
    .command("chat [previous-subject]")
    .description("Start or continue a conversation with Sidekick")
    .option("-l, --list", "List previous subjects")
    .option("-d, --delete <subject>", "Delete a subject")
    .action(async (previousSubject: string | undefined, options) => {
      await chat({
        previousSubject,
        list: options.list,
        delete: options.delete,
      });
    });

  program
    .command("explain <command>")
    .description("Explains a command in plain english")
    .action(async (command: string) => {
      await explain(command);
    });

  program
    .command("gen-code <objective> [destfile]")
    .description(
      "Generates code to complete the objective. If destfile is not specified, code is printed to stdout"
    )
    .option("-l, --language <language>", "Language to generate code in")
    .option(
      "-e, --editable-reference-files <editableReferenceFiles...>",
      "Reference files to use. Sidekick may "
    )
    .option(
      "-r, --reference-files <referenceFiles...>",
      "Reference files to use. These are not editable but are used to generate code"
    )
    .action(async (objective: string, destfile: string | undefined, options) => {
      const { language, editableReferenceFiles, referenceFiles } = options;
      await genCode({
        objective,
        destfile,
        language,
        editableReferenceFiles,
        referenceFiles,
      });
    });

  program
    .command("gen-image <prompt> [destfile]")
    .description(
      "Generates an image to complete the prompt. If destfile is not specified then you will be prompted for the name."
    )
    .option(
      "-s, --size <size>",
      "Size of the image to generate. Valid options are 256x256, 512x512 or 1024x1024"
    )
    .action(async (prompt: string, destfile: string | undefined, options) => {
      await genImage({
        prompt,
        destfile,
        size: options.size,
      });
    });

  program
    .command("list-commands <objective>")
    .description("Lists commands to complete the objective")
    .option("-e, --execute", "Execute the commands")
    .action(async (objective, options) => {
      const execute = options.execute;
      await listCommands(objective, execute);
    });

  program
    .command("sign-in")
    .description("Sign in to OpenAI with your API key")
    .action(async () => {
      await signIn();
    });

  program
    .command("sign-out")
    .description("Sign out of OpenAI and remove the API key from your keychain")
    .action(async () => {
      await signOut();
    });

  program.parse(process.argv);
});
