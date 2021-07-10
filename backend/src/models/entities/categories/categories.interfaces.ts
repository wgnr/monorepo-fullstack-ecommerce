import { ObjectId } from "mongoose"

export interface INewCategory {
  name: string;
  enabled?: boolean
}

export interface ICategory extends INewCategory {
  _id?: ObjectId;
  products: ObjectId[];
}
