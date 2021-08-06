import { Document, PopulatedDoc, } from "mongoose"
import { IUser, UserType } from "@models/entities/users/users.interface";

export interface ISingleMessage {
  date: Date;
  msg: string;
  sender: string;
}

export interface IChat {
  to: PopulatedDoc<IUser & Document>;
  from?: UserType.ADMIN;
  messages?: ISingleMessage[];
}

export interface IMessageDocument extends IChat, Document { }