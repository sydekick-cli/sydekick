import { Keystore } from "../../../keystore/index.js";

const ACCOUNT_NAME = "openai_api_key";

export class OpenAIApiKeystore extends Keystore {
  /**
   * Check to see whether or not an API key is set.
   * @returns - a promise that resolves to true if an API key is set, false otherwise.
   */
  public async getIsApiKeySet(): Promise<boolean> {
    return await this.hasKey(ACCOUNT_NAME);
  }

  /**
   * Get the OpenAI API key from the system keychain.
   * @returns - a promise that resolves to the API key, or null if no API key is set.
   */
  public getApiKey(): Promise<string | null> {
    return this.getKey(ACCOUNT_NAME);
  }

  /**
   * Store an API key in the system keychain.
   * @param apikey - the API key to store.
   * @returns - a promise that resolves to true if the API key was stored, false otherwise.
   */
  public storeApiKey(apikey: string): Promise<boolean> {
    return this.storeKey(ACCOUNT_NAME, apikey);
  }
}
