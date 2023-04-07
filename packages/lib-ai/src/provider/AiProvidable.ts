import {
  IAiChatCompletionProvider,
  IAiCompletionProvider,
  IAiPlatformProvider,
  IImageCreationProvider,
} from "./index.js";

/**
 * The AiProvidable type describes the types of Ai providers that can be used in the application.
 */
export type AiProvidable =
  | IAiPlatformProvider
  | IImageCreationProvider
  | IAiChatCompletionProvider
  | IAiCompletionProvider;
