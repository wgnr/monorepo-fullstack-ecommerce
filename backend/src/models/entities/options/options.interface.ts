import { ObjectId } from "mongoose";

export type valueType = string

export interface IUpdateOption {
  values: valueType[]
}

export interface INewOption extends IUpdateOption {
  name: string;
}

export interface IOptionValue {
  _id: ObjectId;
  value: string;
}

export interface IOptions extends Omit<INewOption, "values"> {
  values: IOptionValue[]
}