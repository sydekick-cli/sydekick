import "reflect-metadata";
import { DataSource } from "typeorm";
import { homedir } from "os";
import { resolve } from "path";
import { existsSync, mkdirSync } from "fs";
import debugLog from "debug";
import { AiPlatform } from "./entity/AiPlatform.entity.js";

const debug = debugLog("@sydekick/lib-db-preferences:data-source");

// ensure the ~/.sydekick directory exists
debug("Ensuring ~/.sydekick directory exists.");
const sydekickDir = resolve(homedir(), ".sydekick");
debug(`Sydekick directory: ${sydekickDir}`);
if (!existsSync(sydekickDir)) {
  debug("Creating ~/.sydekick directory.");
  mkdirSync(sydekickDir);
} else {
  debug(`Sydekick directory already exists.: ${sydekickDir}`);
}

const preferencesDbPath = resolve(sydekickDir, "preferences.db");
debug("Creating ~/.sydekick/preferences.db database.");
export const AppDataSource = new DataSource({
  type: "sqlite",
  database: preferencesDbPath,
  entities: [AiPlatform],
  synchronize: true,
  logging: false,
});
