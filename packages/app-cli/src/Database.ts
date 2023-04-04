import { default as SqliteDb, Database as Db } from "better-sqlite3";
import { homedir } from "os";
import { resolve } from "path";
import { DataHelper } from "./DataHelper.js";

export class Database {
  private static _instance?: Database;
  public static get connection(): Database {
    if (!this._instance) {
      DataHelper.createSidekickDirectory();
      this._instance = new Database();
    }
    return this._instance;
  }

  private readonly _db: Db = new SqliteDb(resolve(homedir(), ".sidekick", "database.db"));
  private constructor() {
    // private constructor
  }

  public get db(): Db {
    return this._db;
  }
}
