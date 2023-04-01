import { spawn } from "child_process";

export type ExecutionResult = {
  exitCode: number;
};

export class Executor {
  private readonly _command: string;

  constructor(command: string) {
    this._command = command;
  }

  /**
   * Executes the command.
   * @returns - The exit code of the command.
   */
  public async execute(): Promise<ExecutionResult> {
    return new Promise((resolve, reject) => {
      const command = spawn(this._command, { shell: true, stdio: "inherit" });

      command.on("close", (exitCode) => {
        resolve({ exitCode: exitCode || 0 });
      });

      command.on("error", (error) => {
        reject(error);
      });
    });
  }
}
