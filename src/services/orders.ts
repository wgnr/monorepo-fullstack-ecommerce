import mongoose, { ClientSession, Document } from "mongoose";
import { CartStatus, ICartDocument } from "@models/entities/carts/carts.interface";
import {
  IOrderDocument,
  IOrderPayload,
  IOrderPayment,
  OrderStatus,
} from "@models/entities/orders/orders.interface";
import { sendOrderSummary } from "@utils/email/index";
import CartsService from "@services/cart";
import OrdersDAO from "@models/entities/orders/orders.dao";
import UsersService from "@services/users";
import ValidationException from "@exceptions/ValidationException";
class OrdersService {
  async getOrdersByUserId(userId: string) {
    return await OrdersDAO.getManyByUserId(userId);
  }

  async getOrdersCountByUserId(userId: string) {
    return await OrdersDAO.getCountByUserId(userId);
  }

  async getById(orderId: string, useLean: boolean = true) {
    return await OrdersDAO.getOneById(orderId, useLean);
  }

  async getByStatus(status: OrderStatus) {
    return await OrdersDAO.getManyByStatus(status);
  }

  async getPopulatedById(orderId: string, useLean: boolean = true) {
    return await OrdersDAO.getPopulatedById(orderId, useLean);
  }

  async getAll() {
    return await OrdersDAO.getMany();
  }

  async create(cartId: string, payload: any) {
    let newOrder;
    const cartPopulated = await CartsService.getPopulatedById(cartId, false);
    if (!(cartPopulated instanceof mongoose.Document)) {
      throw new Error("Internal error, expected a mongoose document");
    }
    await CartsService.validateCartIsNotEmpty(cartPopulated);

    try {
      await mongoose.connection.transaction(async (session: ClientSession) => {
        await CartsService.chageStatus(
          cartPopulated,
          CartStatus.IN_CHECKOUT,
          session
        );
        const total = CartsService.getTotalPrice(cartPopulated);

        const details = await CartsService.getProductsSummary(
          cartPopulated.toJSON()
        );

        newOrder = await OrdersDAO.create({
          cart: cartPopulated._id,
          details,
          payload,
          status: OrderStatus.AWAITING_PAYMENT,
          total,
          user: cartPopulated.user,
        });
      });
    } catch (error) {
      throw new ValidationException(`Order wasn't created. ${error.message}`);
    }

    return newOrder;
  }

  async update(orderId: string, payload: IOrderPayload) {
    const order = await this.getById(orderId, false);

    if (!(order instanceof mongoose.Document)) {
      throw new Error("Internal error, expected a mongoose document");
    }

    if (order.status !== OrderStatus.AWAITING_PAYMENT) {
      throw new ValidationException(`Order can't be updated. It's ${order.status}`);
    }

    order.payload = { ...order.payload, ...payload };
    await order.save();
    return order;
  }

  async pay(orderId: string, paymentPayload: IOrderPayment) {
    const order = await this.getPopulatedById(orderId, false);

    await this.chageStatus(order, OrderStatus.COMPLETED);

    order.payment = { ...paymentPayload };

    await order.save();

    sendOrderSummary(order);

    return order;
  }

  async cancell(orderId: string) {
    const order = await this.getPopulatedById(orderId, false);
    return await this.chageStatus(order, OrderStatus.CANCELLED);
  }

  async chageStatus(order: IOrderDocument, newStatus: OrderStatus) {
    if ([OrderStatus.COMPLETED, OrderStatus.CANCELLED].includes(order.status))
      throw new ValidationException(`Order is ${order.status}!. No action taken`);

    await mongoose.connection.transaction(async (session: ClientSession) => {
      const { cart, user } = order;

      if (
        newStatus === OrderStatus.COMPLETED &&
        order.status === OrderStatus.AWAITING_PAYMENT
      ) {
        await CartsService.chageStatus(cart, CartStatus.PURCHASED, session);
        await UsersService.assignNewCart(user, session);
      } else if (
        newStatus === OrderStatus.CANCELLED &&
        order.status === OrderStatus.AWAITING_PAYMENT
      ) {
        await CartsService.chageStatus(cart, CartStatus.OPEN, session);
      }

      order.status = newStatus;
      await order.save({ session });
    });

    return order;
  }

  async verifyOrderBelongsToUser(orderId: string, userId: string) {
    return await OrdersDAO.checkOrderBelongsToUserById(orderId, userId);
  }
}

export default new OrdersService();
