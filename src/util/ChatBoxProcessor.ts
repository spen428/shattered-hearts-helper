import ChatBoxReader, { ChatLine } from "@alt1/chatbox";
import { ImgRef } from "@alt1/base";
import Logger from "./Logger";

class ChatBoxProcessor {
  private readonly chatBoxReader = new ChatBoxReader();

  getChatLines(img: ImgRef): ChatLine[] {
    if (!img) {
      Logger.writeWarning("ImgRef is null");
      return;
    }

    if (!this.chatBoxReader.pos) {
      this.chatBoxReader.find(img);
    }

    const chatLines = this.chatBoxReader.read(img);
    if (!chatLines?.length) {
      Logger.writeWarning("No chat lines");
      return [];
    }

    return chatLines;
  }
}

export default new ChatBoxProcessor();
