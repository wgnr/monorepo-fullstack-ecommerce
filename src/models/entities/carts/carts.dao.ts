import CommonDAO from "@models/entities/CommonDAO";
import { ICart, CartStatus } from "@models/entities/carts/carts.interface";
import { CategoriesModel } from "@models/entities/carts/carts.model";
import { ClientSession, QueryOptions, Types } from "mongoose";

class CartsDAO extends CommonDAO<ICart> {
  constructor() {
    super(CategoriesModel);
  }

  async getPopulatedById(cartId: string, useLean: boolean = true) {
    this.mongoDebug("getPopulatedById", { cartId });

    return await this.model
      .findById(cartId)
      .lean(useLean)
      .populate({
        path: "variants.variant",
        populate: {
          path: "product",
          model: "product",
        },
      })
      .orFail(this.throwNotFoundError({ cartId }));
  }

  async getManyByStatus(name: CartStatus) {
    this.mongoDebug("getManyByStatus", { name });

    return await this.getMany({ status: name });
  }

  async removeVariants(cartId: string, variantId?: string) {
    this.mongoDebug("removeVariants", { cartId, variantId });

    return await this.updateOneById(
      cartId,
      variantId
        ? {
            $pull: {
              variants: {
                variant: variantId,
              },
            },
          }
        : { $set: { variants: [] } }
    );
  }
}

export default new CartsDAO();
