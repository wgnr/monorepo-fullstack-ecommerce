import { model, Schema, Model, Document } from "mongoose";

const ProductsCollectionName = "products";

export interface INewProduct {
  name: string;
  price?: number;
}

export interface IProduct extends INewProduct {
  id: string;
}

const ProductsSchema = new Schema<IProduct>(
  {
    id: { type: String, require: true },
    name: { type: String, require: true },
    price: { type: Number },
  },
  {
    timestamps: true
  });

export const Product: Model<IProduct> = model<IProduct>(
  ProductsCollectionName,
  ProductsSchema
);