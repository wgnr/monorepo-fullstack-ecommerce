import { Document, PopulatedDoc, Types } from "mongoose";
import { IProduct } from "@models/entities/products/products.interfaces";
import { IOptionSummary } from "@models/entities/options/options.interface";

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

export interface IVariantsDocument extends Omit<IVariants, "options">, Document {
  product: PopulatedDoc<IProduct & Document>;
  options: (string | IOptionSummary)[];
  availableStock: number; // Virtual
}
