import HttpException from "@exceptions/HttpException";
export default class ValidationException extends HttpException {
  constructor(validationError: string) {
    super(400, `Validation error: ${validationError}`);
  }
}
