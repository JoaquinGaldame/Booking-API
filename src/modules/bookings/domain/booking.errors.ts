export class BookingConflictError extends Error {
  constructor() {
    super("Property is already booked for the selected date range");
    this.name = "BookingConflictError";
  }
}

export class BookingLockError extends Error {
  constructor() {
    super("Another booking is being processed for this property and date range");
    this.name = "BookingLockError";
  }
}

export class BookingStatusNotFoundError extends Error {
  constructor(code: string) {
    super(`Booking status not found: ${code}`);
    this.name = "BookingStatusNotFoundError";
  }
}