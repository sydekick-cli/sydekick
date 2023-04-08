import { Command } from "commander";
import { CliCommand } from "./CliCommand.js";
import debugLog from "debug";

class CommandModelList extends CliCommand<undefined> {
  protected override _buildCommanderCommand(program: Command): Command {
    return program.command("list").description("List all models");
  }
  public override run(_options: undefined): Promise<void> {
    const debug = debugLog("@sydekick/app-cli:CommandModelList::run");
    debug("Listing all models");
    // todo
    return Promise.resolve();
  }
  public override parseArgs<T extends unknown[]>(..._args: T): undefined {
    return undefined;
  }
}

export class CommandModel extends CliCommand<undefined> {
  constructor() {
    super();
    this.addSubCommand(new CommandModelList());
  }
  protected override _buildCommanderCommand(program: Command): Command {
    return program.command("model").description("Manage models");
  }
  public override run(_options: undefined): Promise<void> {
    this._commanderCommand?.outputHelp();
    return Promise.resolve();
  }
  public override parseArgs<T extends unknown[]>(..._args: T): undefined {
    return undefined;
  }
}
