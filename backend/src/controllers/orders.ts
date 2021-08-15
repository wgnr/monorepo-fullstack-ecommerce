import Ajv, { JTDSchemaType } from "ajv/dist/jtd";
import { Request, Response, NextFunction } from "express";
import { JWTController } from "@auth/index";
import {
  IOrderNew,
  IOrderPayment,
  OrderStatus,
} from "@models/entities/orders/orders.interface";
import { isValidMongoId } from "@models/index";
import { IUser, IUserDocument } from "@models/entities/users/users.interface";
import { SchemaValidationException } from "@exceptions/index";
import OrdersService from "@services/orders";

class OrdersController extends JWTController {
  async selfResource(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const user = req.user as IUser;
    const {
      params: { orderId },
    } = req;

    if (req.isUnauthenticated()) return next("Unauthenticated");

    if (JWTController.isAdmin(user)) {
      res.locals.isAdmin = { ...res.locals, isAdmin: true };
      return next();
    }

    const { _id } = req.user as IUserDocument;

    if (orderId) {
      const ordersFromUser = await OrdersService.verifyOrderBelongsToUser(
        orderId,
        _id
      );
      if (ordersFromUser === 0) {
        return next("Nothing to show.");
      }
    }

    return next();
  }

  async getAllOrById(req: Request, res: Response, next: NextFunction) {
    const {
      query: { status },
    } = req;
    const {
      params: { orderId },
    } = req;
    const { isAdmin = false } = res.locals;
    const { _id } = req.user as IUserDocument;

    let response;

    try {
      if (isAdmin) {
        if (orderId) {
          response = await OrdersService.getById(orderId);
        } else if (typeof status === "string") {
          response = await OrdersService.getByStatus(status as OrderStatus);
        } else {
          response = await OrdersService.getAll();
        }
      } else {
        if (orderId) {
          response = await OrdersService.getById(orderId);
        } else {
          response = await OrdersService.getOrdersByUserId(_id);
        }
      }
      return res.json(response);
    } catch (error) {
      return next(error);
    }
  }

  async validateCreate(req: Request, res: Response, next: NextFunction) {
    const schema: JTDSchemaType<IOrderNew> = {
      properties: {
        cartId: { type: "string" },
        payload: {
          properties: {
            address: {
              properties: {
                street: { type: "string" },
                CP: { type: "string" },
                streetNumber: { type: "string" },
              },
              optionalProperties: {
                other: { type: "string" },
              },
            },
            contactName: { type: "string" },
            email: { type: "string" },
            phone: { type: "string" },
          },
        },
      },
    };

    const validate = new Ajv().compile<IOrderNew>(schema);
    if (!validate(req.body))
      return next(
        new SchemaValidationException("Category", schema, validate.errors)
      );

    const { cartId } = req.body as IOrderNew;
    if (cartId) {
      const errorFound = isValidMongoId(cartId);
      if (errorFound) return next(errorFound);
    }

    return next();
  }

  async create(req: Request, res: Response, next: NextFunction) {
    const { cartId, payload } = req.body;
    try {
      return res.json(await OrdersService.create(cartId, payload));
    } catch (error) {
      return next(error);
    }
  }

  async validatePay(req: Request, res: Response, next: NextFunction) {
    const schema: JTDSchemaType<IOrderPayment> = {
      properties: {
        method: { type: "string" },
        paymentNumber: { type: "string" },
        totalPayed: { type: "float64" },
      },
    };

    const validate = new Ajv().compile<IOrderPayment>(schema);
    if (!validate(req.body))
      return next(
        new SchemaValidationException("Category", schema, validate.errors)
      );

    return next();
  }

  async pay(req: Request, res: Response, next: NextFunction) {
    const { orderId } = req.params;

    try {
      return res.json(await OrdersService.pay(orderId, req.body));
    } catch (error) {
      return next(error);
    }
  }

  async validateUpdateInfo(req: Request, res: Response, next: NextFunction) {
    const schema: JTDSchemaType<Omit<IOrderNew, "cartId">> = {
      properties: {
        payload: {
          properties: {
            address: {
              properties: {
                street: { type: "string" },
                CP: { type: "string" },
                streetNumber: { type: "string" },
              },
              optionalProperties: {
                other: { type: "string" },
              },
            },
            contactName: { type: "string" },
            email: { type: "string" },
            phone: { type: "string" },
          },
        },
      },
    };

    const validate = new Ajv().compile<Omit<IOrderNew, "cartId">>(schema);
    if (!validate(req.body))
      return next(
        new SchemaValidationException("Category", schema, validate.errors)
      );

    return next();
  }

  async updateInfo(req: Request, res: Response, next: NextFunction) {
    const { orderId } = req.params;
    const { payload } = req.body;

    try {
      return res.json(await OrdersService.update(orderId, payload));
    } catch (error) {
      return next(error);
    }
  }

  async cancell(req: Request, res: Response, next: NextFunction) {
    const { orderId } = req.params;

    try {
      return res.json(await OrdersService.cancell(orderId));
    } catch (error) {
      return next(error);
    }
  }

  validateMongoId(req: Request, res: Response, next: NextFunction) {
    const { orderId, variantId } = req.params;
    let errorFlag = null;
    if (orderId) {
      errorFlag = isValidMongoId(orderId);
    }
    if (variantId) {
      errorFlag = isValidMongoId(variantId);
    }
    return next(errorFlag);
  }
}

export default new OrdersController();
