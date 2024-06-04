export class InvalidFlow extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InvalidFlow";
  }
}