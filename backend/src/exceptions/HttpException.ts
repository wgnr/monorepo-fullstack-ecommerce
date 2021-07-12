import { GlobalVars } from "@config/globalVars"

const { debug: { SHOW_ERROR_TRACE } } = GlobalVars

export default class HttpException extends Error {
  constructor(
    public status: number,
    public message: string) {
    super(message);
  }

  getJSON() {
    return {
      status: this.status,
      message: this.message,
      ...(SHOW_ERROR_TRACE ? { stack: this.stack } : {})
    }
  }
}