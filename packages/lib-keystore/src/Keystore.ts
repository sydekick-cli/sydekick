import { formatError } from "@sydekick/lib-util";
import debugLog from "debug";
import keytar from "keytar";

export class Keystore {
  public static getInstance(serviceName = "sydekick"): Keystore {
    return new Keystore(serviceName);
  }

  constructor(private readonly _serviceName = "sydekick") {
    this.deleteKey = this.deleteKey.bind(this);
    this.getKey = this.getKey.bind(this);
    this.hasKey = this.hasKey.bind(this);
    this.storeKey = this.storeKey.bind(this);
  }

  /**
   * Delete a key from the system keychain.
   * @param keyName - the name of the key.
   * @returns - true if the key was deleted, false if the key was not found.
   */
  public async deleteKey(keyName: string): Promise<boolean> {
    const debug = debugLog("@sydekick/lib-keystore:deleteKey");
    debug(`Deleting key ${keyName}... for service ${this._serviceName}...`);
    let success = false;
    try {
      success = await keytar.deletePassword(this._serviceName, keyName);
    } catch (error) {
      debug(`Error deleting key ${keyName}: ${formatError(error)}`);
    }
    if (!success) {
      debug(`Key ${keyName} not found.`);
    } else {
      debug(`Key ${keyName} deleted.`);
    }
    return success;
  }

  /**
   * Get a key from the system keychain.
   * @param keyName - the name of the key.
   * @returns - the value of the key, or null if the key was not found.
   */
  public async getKey(keyName: string): Promise<string | null> {
    const debug = debugLog("@sydekick/lib-keystore:getKey");
    debug(`Getting key ${keyName}... for service ${this._serviceName}...`);
    let key: string | null = null;
    try {
      key = await keytar.getPassword(this._serviceName, keyName);
    } catch (error) {
      debug(`Error getting key ${keyName}: ${formatError(error)}`);
    }
    if (!key) {
      debug(`Key ${keyName} not found.`);
    } else {
      debug(`Key ${keyName} retrieved.`);
    }
    return key;
  }

  /**
   * Check if a key exists in the system keychain.
   * @param keyName - the name of the key.
   * @returns - true if the key exists, false otherwise.
   */
  public async hasKey(keyName: string): Promise<boolean> {
    const debug = debugLog("@sydekick/lib-keystore:hasKey");
    debug(`Checking if key ${keyName} exists...`);
    const key = await this.getKey(keyName);
    if (!key) {
      debug(`Key ${keyName} not found.`);
      return false;
    } else {
      debug(`Key ${keyName} exists.`);
      return true;
    }
  }

  /**
   * Store a key in the system keychain.
   * @param keyName - the name of the key.
   * @param keyValue - the value of the key.
   * @returns - true if the key was stored successfully, false otherwise.
   */
  public async storeKey(keyName: string, keyValue: string): Promise<boolean> {
    const debug = debugLog("@sydekick/lib-keystore:storeKey");
    debug(`Storing key ${keyName}... for service ${this._serviceName}...`);
    try {
      await keytar.setPassword(this._serviceName, keyName, keyValue);
    } catch (error) {
      debug(`Error storing key ${keyName}: ${formatError(error)}`);
      return false;
    }
    debug(`Key ${keyName} stored.`);
    return true;
  }
}
