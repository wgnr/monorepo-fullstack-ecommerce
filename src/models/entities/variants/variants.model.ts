export const collectionName = "variant";
import { model, Schema, Model } from "mongoose";
// import mongooseLeanVirtuals from "mongoose-lean-virtuals";
import {
  IVariants,
  IVariantsDocument,
} from "@models/entities/variants/variants.interfaces";
import { collectionName as OptionsCollectionName } from "@models/entities/options/options.model";

const VariantsSchema = new Schema<IVariants>(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: "product",
    },
    stock: { type: Number, default: 0 },
    stockInCheckout: { type: Number, default: 0 },
    options: [Schema.Types.ObjectId],
  },
  {
    versionKey: false,
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
  }
);

// There is a small caveat using virtuals and leans. I decided not to implement them
// VariantsSchema.virtual("availableStock").get(function (this: IVariantsDocument) {
//   return this.stock - this.stockInCheckout;
// });

// VariantsSchema.plugin(mongooseLeanVirtuals);

export const VariantsModel = model<IVariants>(collectionName, VariantsSchema);
