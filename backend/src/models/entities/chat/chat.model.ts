import { model, Schema, Model } from "mongoose";
import { UserType } from "@models/entities/users/users.interface";
import { IChat, ISingleMessage } from "@models/entities/chat/chat.interface";

export const collectionName = "chat";

const MessageSchema = new Schema<ISingleMessage>(
  {
    date: { type: Date, default: new Date() },
    msg: String,
    sender: String,
  },
  {
    versionKey: false,
    _id: false,
  }
);

const ChatsSchema = new Schema<IChat>(
  {
    to: {
      type: Schema.Types.ObjectId,
      ref: "user",
      unique: true,
    },
    from: { type: String, default: UserType.ADMIN },
    messages: [MessageSchema],
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

export const ChatsModel: Model<IChat> = model<IChat>(collectionName, ChatsSchema);
