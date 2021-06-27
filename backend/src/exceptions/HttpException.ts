import { GlobalVars } from "@config/GlobalVars"

const { debug: { showErrorTrace } } = GlobalVars

export default abstract class HttpException extends Error {
  constructor(
    public status: number,
    public message: string) {
    super(message);
  }

  getJSON() {
    return {
      status: this.status,
      message: this.message,
      ...(showErrorTrace ? { stack: this.stack } : {})
    }
  }
}