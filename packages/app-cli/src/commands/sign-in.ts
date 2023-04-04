import { Api } from "../Api.js";

export async function signIn() {
  await Api.storeApiKey();
}
