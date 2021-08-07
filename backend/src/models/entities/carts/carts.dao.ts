import CommonDAO from "@models/entities/CommonDAO";
import { ICart, CartStatus } from "@models/entities/carts/carts.interface";
import { CategoriesModel } from "@models/entities/carts/carts.model";

class CartsDAO extends CommonDAO<ICart> {
  constructor() {
    super(CategoriesModel);
  }

  async getPopulatedById(cartId: string) {
    this.mongoDebug("getPopulatedById", { cartId });

    return await this.model
      .findById(cartId)
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
}

export default new CartsDAO();
