import { Command } from "commander";
import debugLog from "debug";

export abstract class CliCommand<Options = unknown> {
  protected abstract _buildCommanderCommand(program: Command): Command;
  protected readonly _subCommands: CliCommand[] = [];
  protected _commanderCommand?: Command;

  protected addSubCommand(command: CliCommand): void {
    this._subCommands.push(command);
  }

  /**
   * Build the commander command for the command.
   * @param program - the commander program.
   */
  public buildCommanderCommand(program: Command): void {
    const debug = debugLog("@sydekick/app-cli:CliCommand::buildCommanderCommand");
    this._commanderCommand = this._buildCommanderCommand(program).action(async (...args) => {
      const options = this.parseArgs(...args);
      debug(`Running command ${program.name()} with options: ${JSON.stringify(options)}`);
      await this.run(options);
      debug(`Command ${program.name()} completed.`);
    });
    for (const subCommand of this._subCommands) {
      subCommand.buildCommanderCommand(this._commanderCommand);
    }
    program = this._commanderCommand;
  }

  /**
   * Run the command.
   * @param options - the options for the command.
   * @reutrns - a promise that resolves when the command is complete.
   */
  public abstract run(options: Options): Promise<void>;

  /**
   * Parse the arguments passed to the command.
   * @param args - the arguments passed to the command.
   * @returns - the options for the command.
   */
  public abstract parseArgs<T extends unknown[]>(...args: T): Options;
}
