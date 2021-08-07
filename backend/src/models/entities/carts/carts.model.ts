import { Model, model, Schema } from "mongoose";
import { ICart, CartStatus } from "@models/entities/carts/carts.interface";

export const collectionName = "cart";

const cartsSchema = new Schema<ICart>(
  {
    status: {
      type: String,
      enum: Object.values(CartStatus),
      default: CartStatus.OPEN,
    },
    variants: [
      {
        variant: {
          type: Schema.Types.ObjectId,
          ref: "variant",
        },
        quantity: {
          type: Number,
          require: true,
          default: 0,
        },
        comment: String,
      },
    ],
    user: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

export const CategoriesModel: Model<ICart> = model<ICart>(collectionName, cartsSchema);
