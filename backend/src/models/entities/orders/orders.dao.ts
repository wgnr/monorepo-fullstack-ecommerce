import CommonDAO from "@models/entities/CommonDAO"
import { IOrder, OrderStatus } from "@models/entities/orders/orders.interface"
import { OrdersModel } from "@models/entities/orders/orders.model"


class OrdersDAO extends CommonDAO<IOrder>{
  constructor() {
    super(OrdersModel)
  }

  async getManyByStatus(name: OrderStatus) {
    this.mongoDebug("getManyByStatus", { name })

    return await this.getMany({ status: name })
  }

  async getPopulatedById(id: string) {
    this.mongoDebug("getPopulatedById", { id })

    return await this.model.findById(id)
      .populate("cart")
      .orFail(this.throwNotFoundError({ id }))
  }
}

export default new OrdersDAO
