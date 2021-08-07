export const collectionName = "product";
import { model, Schema, Model } from "mongoose";
import { IProduct } from "@models/entities/products/products.interfaces"
import { collectionName as CategoriesCollectionName } from "@models/entities/categories/categories.model"
import { collectionName as OptionsCollectionName } from "@models/entities/options/options.model"

const ProductsSchema = new Schema<IProduct>(
  {
    categories: [{
      type: Schema.Types.ObjectId,
      ref: "category"//CategoriesCollectionName
    }],
    deletedAt: Date,
    description: String,
    photos: [String],
    name: { type: String, require: true },
    price: { type: Number, default: 0 },
    slug: String,
    variants: [{
      type: Schema.Types.ObjectId,
      ref: "variant"
    }]
  },
  {
    timestamps: true,
    versionKey: false
  });



export const ProductsModel: Model<IProduct> = model<IProduct>(
  collectionName,
  ProductsSchema
);



  // image: {
  //   type: String,
  //   get: (i: string): string => `localhost:3000/${i}`
  // },
  // https://mongoosejs.com/docs/subdocs.html#finding-a-subdocument
  // const doc = parent.children.id(_id); // find sub doc
  // create a new subdoc
  // const newdoc = parent.children.create({ name: 'Aaron' });
  // variants: { type: [VariantsSchema], default: () => [] }, // TODO CHECK