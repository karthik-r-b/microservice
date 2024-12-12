import ErrorResponse from "./error-response.js";
class BadRequestError extends ErrorResponse {
  constructor(message, statusCode, meta = {}) {
    super(message, statusCode, meta);
    Error.captureStackTrace(this, BadRequestError);
    let proto = Object.getPrototypeOf(this);
    proto.name = "BadRequestError";
    this.meta = meta;
  }
  toString() {
    return `${this.name}: ${this.message} - ${JSON.stringify(this.meta)}`;
  }
}

export default BadRequestError;
