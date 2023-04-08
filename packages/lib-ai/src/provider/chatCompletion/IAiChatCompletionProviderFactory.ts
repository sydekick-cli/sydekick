import { IAiProviderFactory } from "../IAiProviderFactory.js";
import { IAiChatCompletionProvider } from "./IAiChatCompletionProvider.js";

export interface IAiChatCompletionProviderFactory<
  Provider extends IAiChatCompletionProvider = IAiChatCompletionProvider
> extends IAiProviderFactory<Provider> {
  // empty
}
