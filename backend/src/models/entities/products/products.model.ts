import { model, Schema, Model } from "mongoose";
import { IProduct } from "@models/entities/products/products.interfaces";

export const collectionName = "product";

const ProductsSchema = new Schema<IProduct>(
  {
    categories: [
      {
        type: Schema.Types.ObjectId,
        ref: "category",
      },
    ],
    deletedAt: Date,
    description: String,
    photos: [String],
    name: { type: String, require: true },
    price: { type: Number, default: 0 },
    slug: String,
    variants: [
      {
        type: Schema.Types.ObjectId,
        ref: "variant",
      },
    ],
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const ProductsModel: Model<IProduct> = model<IProduct>(
  collectionName,
  ProductsSchema
);
