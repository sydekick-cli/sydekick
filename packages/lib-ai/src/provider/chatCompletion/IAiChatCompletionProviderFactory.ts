import { IAiProviderFactory } from "../IAiProviderFactory.js";
import { IAiChatCompletionProvider } from "./IAiChatCompletionProvider.js";

export type IAiChatCompletionProviderFactory<
  Provider extends IAiChatCompletionProvider = IAiChatCompletionProvider
> = IAiProviderFactory<Provider>;
