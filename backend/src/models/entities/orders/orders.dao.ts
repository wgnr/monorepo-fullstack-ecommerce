import CommonDAO from "@models/entities/CommonDAO";
import { IOrder, IOrderDocument, OrderStatus } from "@models/entities/orders/orders.interface";
import { OrdersModel } from "@models/entities/orders/orders.model";

class OrdersDAO extends CommonDAO<IOrder> {
  constructor() {
    super(OrdersModel);
  }

  async getManyByStatus(name: OrderStatus) {
    this.mongoDebug("getManyByStatus", { name });

    return await this.getMany({ status: name });
  }

  async getPopulatedById(id: string): Promise<IOrderDocument> {
    this.mongoDebug("getPopulatedById", { id });

    return (await this.model
      .findById(id)
      .populate("cart")
      .orFail(this.throwNotFoundError({ id }))) as IOrderDocument;
  }

  async getManyByUserId(userId: string) {
    this.mongoDebug("getManyByUserId", { userId });

    return await this.model
      .find({ user: userId })
      .lean()
      .orFail(this.throwNotFoundError({ userId }));
  }

  async getCountByUserId(userId: string) {
    this.mongoDebug("getCountByUserId", { userId });

    return await this.model.countDocuments({ user: userId });
  }

  async checkOrderBelongsToUserById(orderId: string, userId: string) {
    this.mongoDebug("checkOrderBelongsToUserById", { userId });

    return await this.model.countDocuments({ user: userId, _id: orderId });
  }
}

export default new OrdersDAO();
