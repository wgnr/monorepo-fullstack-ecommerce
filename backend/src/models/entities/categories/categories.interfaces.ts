import { Document, PopulatedDoc, ObjectId } from 'mongoose';
import { IProduct } from "@models/entities/products/products.interfaces"

interface ICategoryBase {
  name: string;
}

// Controller Interfaces
export interface ICategoryAddProduct {
  products: string[]
}

export interface ICategoryNew extends ICategoryBase {
  products?: string[]
}

// Model Interfaces
export interface ICategory extends ICategoryBase {
  products: PopulatedDoc<IProduct & Document>[];
  // products: string[]
}
export interface ICategoryDocument extends ICategoryBase, Document {
}
