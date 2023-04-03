import * as readline from "readline";

export class Prompt {
  public static async getRequiredInput(question: string): Promise<string> {
    const u = await Prompt.prompt(question, "");
    if (!u) {
      console.log("Please enter a response.");
      return await Prompt.getRequiredInput(question);
    }
    return u.toLowerCase();
  }

  /**
   * Prompts the user for input.
   * @param question - The question to ask the user.
   * @param defaultValue - The default value to use if the user does not provide input.
   * @returns The user's input or the default value.
   */
  public static async prompt(question: string, defaultValue: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
      });

      rl.question(question, (answer) => {
        rl.close();
        resolve(answer || defaultValue);
      });
    });
  }
}
