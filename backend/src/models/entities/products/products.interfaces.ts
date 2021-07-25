import { Document, PopulatedDoc } from 'mongoose';
import { ICategory } from "@models/entities/categories/categories.interfaces"
import { IVariantBase, IVariants } from "@models/entities/variants/variants.interfaces"

export interface IProductBase {
  description?: string;
  img?: string;
  name: string;
  price?: number;
  slug?: string;
}

export interface IProductNew extends IProductBase {
  categories?: string[];
  variants?: IVariantBase[];
}

// Model Interfaces
export interface IProduct extends IProductBase {
  categories: PopulatedDoc<ICategory & Document>[];
  // categories: string[];
  deletedAt?: string;
  // variants: string[];
  variants: PopulatedDoc<IVariants & Document>[];
}

export interface IProductDocument extends IProductBase, Document {
  categories: PopulatedDoc<ICategory & Document>[];
  deletedAt?: Date;
  variants: PopulatedDoc<IVariants & Document>[];
}