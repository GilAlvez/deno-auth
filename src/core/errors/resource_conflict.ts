export class ResourceConflict extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ResourceConflict";
  }
}