import { Document, PopulatedDoc, ObjectId } from 'mongoose';
import { IProduct } from "@models/entities/products/products.interfaces"

export interface INewCategory {
  name: string;
  products?: string[]
}

export interface IAddProduct {
  products: string[]
}

export interface ICategory extends INewCategory {
  products: PopulatedDoc<IProduct & Document>[];
}
