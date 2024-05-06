import { BaseError } from "./base-error";

export default class BadRequestError extends BaseError {
  private readonly _code: number = 400;
  private readonly _context: { [key: string]: any };

  constructor(params?: {code?: number, message?: string, context?: { [key: string]: any }}) {
    const { code, message } = params || {};
    super(message || "Bad request");

    this._code = code || this._code;
    this._context = params?.context || {};

    Object.setPrototypeOf(this, BadRequestError.prototype);
  }

  get errors() {
    return [{ message: this.message, context: this._context }];
  }

  get statusCode() {
    return this._code;
  }
}
