import CommonDAO from "@models/entities/CommonDAO";
import { IChat, ISingleMessage } from "@models/entities/chat/chat.interface";
import { ChatsModel } from "@models/entities/chat/chat.model";

class ChatsDAO extends CommonDAO<IChat> {
  constructor() {
    super(ChatsModel);
  }
  async getByTo(to: string) {
    this.mongoDebug("getByTo", { to });

    return await this.model.findOne({ to }).lean();
  }

  async insertMessage(to: string, msg: ISingleMessage) {
    this.mongoDebug("getByTo", { to });

    return await this.model
      .updateOne(
        { to },
        {
          $push: { messages: msg },
        }
      )
      .lean();
  }
}

export default new ChatsDAO();
