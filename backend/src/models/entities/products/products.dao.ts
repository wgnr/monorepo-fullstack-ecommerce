import { ObjectId, Types } from "mongoose";
import CommonDAO from "@models/entities/CommonDAO";
import { IProduct } from "@models/entities/products/products.interfaces";
import { ProductsModel } from "@models/entities/products/products.model";

class ProductsDAO extends CommonDAO<IProduct> {
  constructor() {
    super(ProductsModel);
  }

  async getManyByCategoryId(id: string) {
    this.mongoDebug("getManyByCategoryId", { id });

    // @ts-ignore
    return await this.getMany({ categories: id });
  }

  async getPopulatedById(id: string) {
    this.mongoDebug("getPopulatedById", { id });

    return await this.model
      .findOne({ _id: id })
      .populate({ path: "categories", select: "-products" })
      .populate({ path: "variants", select: "-product" })
      // .populate("variants.options") //  populate options https://stackoverflow.com/questions/24414975/mongoose-populate-sub-sub-document
      .orFail(this.throwNotFoundError({ id }));
  }

  async getByVariantId(id: string) {
    this.mongoDebug("getVariantById", { id });

    return await this.model
      .findOne({ "variants._id": Types.ObjectId(id) })
      .orFail(this.throwNotFoundError({ id }));
  }

  async updateProduct(productId: string, payload: IProduct) {
    this.mongoDebug("updateProduct", { productId, payload });

    return await this.updateOneById(productId, { $set: payload });
  }

  async addCategory(productIds: ObjectId | ObjectId[], categoryId: string) {
    this.mongoDebug("addCategory", { productIds, categoryId });

    await this.model
      .updateMany(
        { _id: Array.isArray(productIds) ? { $in: productIds } : productIds },
        { $addToSet: { categories: categoryId } }
      )
      .orFail(this.throwNotFoundError({ productIds }));
  }

  async insertImage(productId: string, fileName: string) {
    this.mongoDebug("insertImage", { productId, fileName });

    await this.model
      .updateOne({ _id: productId }, { $addToSet: { photos: fileName } })
      .orFail(this.throwNotFoundError({ productId }));
  }
  async removeImage(productId: string, fileName: string) {
    this.mongoDebug("removeImage", { productId, fileName });

    await this.model
      .updateOne({ _id: productId }, { $pull: { photos: fileName } })
      .orFail(this.throwNotFoundError({ productId }));
  }

  async removeCategory(productId: string | string[] | null, categoryId: string) {
    this.mongoDebug("removeCategory", { productId, categoryId });

    const update = { $pull: { categories: categoryId } };
    if (!productId) {
      await this.model
        .updateMany({}, update)
        .orFail(this.throwNotFoundError({ productId }));
    } else if (Array.isArray(productId)) {
      await this.model
        .updateMany({ _id: { $in: productId } }, update)
        .orFail(this.throwNotFoundError({ productId }));
    } else {
      await this.updateOneById(productId, update);
    }
  }

  async deleteById(id: ObjectId) {
    this.mongoDebug("deleteById", { id });

    // const deletedAt = { $set: { deletedAt: new Date } }
    // // @ts-ignore
    // return await this.delete(id, deletedAt)

    const response = await this.model
      .deleteOne({ _id: id })
      .orFail(this.throwNotFoundError({ id }));

    return response.n;
  }
}

export default new ProductsDAO();
