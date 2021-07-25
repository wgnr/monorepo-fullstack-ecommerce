import CommonDAO from "@models/entities/CommonDAO"
import { ICart, CartStatus } from "@models/entities/carts/carts.interface"
import { CategoriesModel } from "@models/entities/carts/carts.model"


class CartsDAO extends CommonDAO<ICart>{
  constructor() {
    super(CategoriesModel)
  }

  async getManyByStatusName(name: CartStatus) {
    this.mongoDebug("getManyByStatusName", { name })

    return await this.getMany({ status: name })
  }
}

export default new CartsDAO
