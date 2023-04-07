#!/usr/bin/env node
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

import { Command as CommanderCommand } from "commander";

import { listCommands } from "./commands/list-commands.js";
import { explain } from "./commands/explain.js";
import { genCode } from "./commands/gen-code.js";
import { CommandChat } from "./commands/chat.js";
import { genImage } from "./commands/gen-image.js";
import fs from "fs/promises";
import { CliCommand } from "./commands/CliCommand.js";
import { CommandProvider } from "./commands/provider.js";

async function readPackageJson() {
  const fileContent = await fs.readFile(resolve(__dirname, "../", "./package.json"), "utf-8");
  const packageJson = JSON.parse(fileContent);
  return packageJson;
}

const commands: CliCommand[] = [new CommandChat(), new CommandProvider()];

void readPackageJson().then((packageJson) => {
  const program = new CommanderCommand();
  program.description("Assists with CLI commands using ChatGPT").version(packageJson.version);

  for (const command of commands) {
    command.buildCommanderCommand(program);
  }

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
    .option("-d, --directory <directory>", "Output directory for generated code")
    .action(async (objective: string, destfile: string | undefined, options) => {
      const { language, editableReferenceFiles, referenceFiles, directory } = options;
      await genCode({
        objective,
        destfile,
        directory,
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

  program.parse(process.argv);
});
