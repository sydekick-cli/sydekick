import { OpenAIApi, Configuration } from "openai";
import keytar from "keytar";
import inquirer from "inquirer";

const SERVICE_NAME = "sidekick";
const ACCOUNT_NAME = "openai_api_key";

export class Api {
  private static _instance?: OpenAIApi;
  private constructor() {
    // private constructor
  }

  public static async storeApiKey() {
    const { apiKey } = await inquirer.prompt([
      {
        type: "password",
        name: "apiKey",
        message: "Please enter your OpenAI API key:",
      },
    ]);

    // Store the API key securely using keytar
    await keytar.setPassword(SERVICE_NAME, ACCOUNT_NAME, apiKey);
    console.log("API key saved securely.");
  }

  public static async getApiKey() {
    // Retrieve the API key securely using keytar
    return await keytar.getPassword(SERVICE_NAME, ACCOUNT_NAME);
  }

  public static async clearApiKey() {
    // Delete the API key securely using keytar
    await keytar.deletePassword(SERVICE_NAME, ACCOUNT_NAME);
    console.log("API key cleared.");
  }

  public static async getInstance(): Promise<OpenAIApi> {
    if (!this._instance) {
      let apiKey: string | null = await Api.getApiKey();
      if (!apiKey) {
        await Api.storeApiKey(); // prompt for API key
        apiKey = await Api.getApiKey();
      }
      if (!apiKey) throw new Error("No API key found.");
      this._instance = new OpenAIApi(new Configuration({ apiKey }));
    }
    return this._instance;
  }
}
