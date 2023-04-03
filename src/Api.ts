import { OpenAIApi, Configuration } from "openai";

export class Api {
  private static _instance?: OpenAIApi;
  private constructor() {
    // private constructor
  }

  public static get instance(): OpenAIApi {
    if (!this._instance) {
      const openaiApiKey = process.env.CHATGPT_API_KEY;
      if (!openaiApiKey) {
        console.error(
          "Please set the environment variable CHATGPT_API_KEY to your OpenAI API key."
        );
        process.exit(1);
      }
      this._instance = new OpenAIApi(new Configuration({ apiKey: openaiApiKey }));
    }
    return this._instance;
  }
}
