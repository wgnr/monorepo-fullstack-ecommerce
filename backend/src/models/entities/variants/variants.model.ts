export const collectionName = "variant";
import { model, Schema, Model } from "mongoose";
import { IVariants } from "@models/entities/variants/variants.interfaces"
import { collectionName as OptionsCollectionName } from "@models/entities/options/options.model"

const VariantsSchema = new Schema<IVariants>({
  product: {
    type: Schema.Types.ObjectId,
    ref: "product"
  },
  stock: { type: Number, default: 0 },
  stockInCheckout: { type: Number, default: 0 },
  options: [Schema.Types.ObjectId]
}, {
  versionKey: false
})

export const VariantsModel: Model<IVariants> = model<IVariants>(
  collectionName,
  VariantsSchema
);


// ProductsSchema.virtual("availableStock").get(function (this) {
//   return this.price
// });