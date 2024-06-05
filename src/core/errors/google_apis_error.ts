export class GoogleApisError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "GoogleApisError";
  }
}