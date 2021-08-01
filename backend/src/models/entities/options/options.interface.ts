import { Document } from "mongoose";

interface IOptionsBase {
  name: string;
}

export interface IOptionSummary{
  option: {
      id: string;
      name: string;
  };
  value: {
      id: string;
      name: string;
  };
}

// Controller interfaces
export type valueType = string

export interface IUpdateOption {
  values: valueType[]
}
export interface IDeleteOption {
  values?: valueType[]
}

export interface IOptionNew extends IOptionsBase, IUpdateOption { }

// Model Interfaces
export interface IOptionValue {
  value: string;
}

export interface IOptions extends IOptionsBase {
  values: IOptionValue[]
}

export interface IOptionValueDocument extends Document {
  value: string;
}

export interface IOptionsDocument extends IOptionsBase, Document {
  values: IOptionValueDocument[]
}