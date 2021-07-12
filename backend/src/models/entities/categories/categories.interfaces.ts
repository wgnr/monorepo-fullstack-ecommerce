import { Document, PopulatedDoc, ObjectId } from 'mongoose';
import { IProduct } from "@models/entities/products/products.interfaces"

export interface INewCategory {
  name: string;
  enabled?: boolean
}

export interface ICategory extends INewCategory {
  _id?: ObjectId;
  products: PopulatedDoc<IProduct & Document>,
}
