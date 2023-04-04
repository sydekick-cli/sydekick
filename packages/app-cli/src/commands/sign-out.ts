import { Api } from "../Api.js";

export async function signOut() {
  const isSignedIn = !!(await Api.getApiKey());
  if (!isSignedIn) {
    console.log("You are not signed in.");
    return;
  }

  await Api.clearApiKey();
}
