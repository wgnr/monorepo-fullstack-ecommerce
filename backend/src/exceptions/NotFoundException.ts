import HttpException from "@exceptions/HttpException";
export default class NotFound extends HttpException {
  constructor(public resource: string, public filter: {}) {
    super(404, `Resource not found`)
  }

  getJSON() {
    return {
      ...super.getJSON(),
      resource: this.resource,
      filter: this.filter
    }
  }
}