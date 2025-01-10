import { ChatLine } from "alt1/chatbox";

class Logger {
  writeLog(message: string | ChatLine, color: string = "white") {
    console.log(message);
  }

  writeError(message: string | ChatLine) {
    console.error(message);
  }

  writeWarning(message: string | ChatLine) {
    console.warn(message);
  }
}

export default new Logger();
