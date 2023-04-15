import { SydekickError } from "./SydekickError.js";

export class InternalSydekickError extends SydekickError {
  constructor(message: string) {
    super(message, false);
  }
}
