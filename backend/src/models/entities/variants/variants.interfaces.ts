import { Document, PopulatedDoc, Types } from 'mongoose';
import { IProduct } from "@models/entities/products/products.interfaces"

export interface IVariantBase {
  options?: string[];
  stock: number;
}

export interface IVariantUpdate {
  stock: number;
}

// Model Interfaces
export interface IVariants {
  product: string;
  options: string[];
  stock: number;
  stockInCheckout: number;
}

export interface IVariantsDocument extends IVariants, Document {
  product: PopulatedDoc<IProduct & Document>;
}

