import { Document, PopulatedDoc, ObjectId } from 'mongoose';
import { IProduct } from "@models/entities/products/products.interfaces"

// CI: Controller Interface
export interface INewCategory {
  name: string;
  products?: string[]
}

export interface IAddProduct {
  products: string[]
}

export interface ICategory extends INewCategory {
  // _id?: ObjectId;
  // __v?: string;
  products: PopulatedDoc<IProduct & Document>[];
}

// export interface MICategory extends Omit<Omit<ICategory, "_id">, "__v">, Document { }