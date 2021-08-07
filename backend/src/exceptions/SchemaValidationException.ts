import { ErrorObject } from "ajv";
import HttpException from "@exceptions/HttpException";

export default class SchemaValidationException extends HttpException {
  validations: object;

  constructor(
    validationName: string,
    validationSchema: object,
    errorArr: ErrorObject[] | null | undefined
  ) {
    super(400, `Error validating: ${validationName}`);
    this.validations = {
      validationName,
      validationSchema,
      errorArr,
    };
  }

  getJSON() {
    return {
      ...super.getJSON(),
      validations: this.validations,
    };
  }
}
