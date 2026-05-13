export class PropertyNotFoundError extends Error {
  constructor(propertyId: string) {
    super(`Property with id ${propertyId} was not found`);
    this.name = "PropertyNotFoundError";
  }
}

export class InvalidPropertyDataError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InvalidPropertyDataError";
  }
}