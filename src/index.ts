#!/usr/bin/env node
import { resolve } from "path";
import { config } from "dotenv";
config({
  path: resolve(__dirname, "../../.env"),
});

import { version } from "../package.json"
import { Command } from "commander";

import { listCommands } from "./commands/list-commands";
import { explain } from "./commands/explain";
import { genCode } from "./commands/gen-code";

const program = new Command();
program
  .command("explain <command>")
  .description("Explains a command in plain english")
  .action(async (command: string) => {
    await explain(command);
  });

program
  .command("gen-code <objective> [destfile]")
  .description("Generates code to complete the objective. If destfile is not specified, code is printed to stdout")
  .option("-l, --language <language>", "Language to generate code in")
  .option("-e, --editable-reference-files <editableReferenceFiles...>", "Reference files to use. Sidekick may ")
  .option("-r, --reference-files <referenceFiles...>", "Reference files to use. These are not editable but are used to generate code")
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
  .description("Assists with CLI commands using ChatGPT")
  .version(version)
  .command("list-commands <objective>")
  .description("Lists commands to complete the objective")
  .option("-e, --execute", "Execute the commands")
  .action(async (objective, options) => {
    const execute = options.execute;
    await listCommands(objective, execute);
  });

program.parse(process.argv);
