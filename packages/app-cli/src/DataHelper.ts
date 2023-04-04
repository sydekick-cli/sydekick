import { existsSync, mkdirSync } from "fs";
import { homedir } from "os";
import { resolve } from "path";

export class DataHelper {
  public static createSidekickDirectory(): void {
    if (!DataHelper.doesSidekickDirectoryExist()) {
      mkdirSync(resolve(homedir(), ".sidekick"));
    }
  }

  public static doesSidekickDirectoryExist(): boolean {
    return existsSync(resolve(homedir(), ".sidekick"));
  }
}
