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

const program = new Command();

program
.description("Assists with CLI commands using ChatGPT")
  .version(version)
  .command("list-commands <objective>")
  .description("Lists commands to complete the objective")
  .action(async (objective: string) => {
    await listCommands(objective);
  });

program
  .command("explain <command>")
  .description("Explains a command in plain english")
  .action(async (command: string) => {
    await explain(command);
  });

program.parse(process.argv);
