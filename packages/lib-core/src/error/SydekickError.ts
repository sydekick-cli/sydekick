// src/index.ts

export class SydekickError extends Error {
  public readonly isUserFacing: boolean;

  constructor(message: string, isUserFacing = true) {
    super(message);
    this.isUserFacing = isUserFacing;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
