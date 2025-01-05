import {ChatLine} from "@alt1/chatbox";

class Logger {
    writeLog(message: string | ChatLine, color: string = "white") {
        const logElement = document.getElementById("log");

        if (typeof message === "string") {
            const span = document.createElement("span");
            span.style.color = color;
            span.textContent = message;

            logElement.append(span);
            return;
        }

        message.fragments.forEach((fragment) => {
            const span = document.createElement("span");
            span.style.color = `rgb(${fragment.color.join(",")})`;
            span.textContent = fragment.text;

            logElement.append(span);
        });

        logElement.lastElementChild.scrollIntoView({behavior: "smooth"});
    }

    writeError(message: string | ChatLine) {
        this.writeLog("ERROR: " + message, "red");
    }

    writeWarning(message: string | ChatLine) {
        this.writeLog("WARN: " + message, "orange");
    }
}

export default new Logger();
