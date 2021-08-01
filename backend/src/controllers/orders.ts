import Ajv, { JTDSchemaType } from "ajv/dist/jtd"
import { Request, Response, NextFunction } from "express";
import OrdersService from "@services/orders"
import { isValidMongoId } from "@models/index";
import { IOrderNew, IOrderPayment, OrderStatus } from "@models/entities/orders/orders.interface";
import { SchemaValidationException } from "@exceptions/index";

class OrdersController {
  async getAllOrById(req: Request, res: Response, next: NextFunction) {
    const { query: { status } } = req
    const { params: { id } } = req
    let response

    try {
      if (id) {
        response = await OrdersService.getById(id)
      } else if (typeof status === "string") {
        response = await OrdersService.getByStatus(status as OrderStatus)
      } else {
        response = await OrdersService.getAll()
      }
      return res.json(response)
    } catch (error) {
      return next(error)
    }
  }

  async validateCreate(req: Request, res: Response, next: NextFunction) {
    const schema: JTDSchemaType<IOrderNew> = {
      properties: {
        cartId: { type: "string" },
        payload: {
          properties: {
            address: {
              properties: { street: { type: "string" }, },
            },
            email: { type: "string" },
            phone: { type: "string" },
          },
        }
      }
    }

    const validate = new Ajv().compile<IOrderNew>(schema)
    if (!validate(req.body))
      return next(new SchemaValidationException("Category", schema, validate.errors))

    const { cartId } = req.body as IOrderNew
    if (cartId) {
      const errorFound = isValidMongoId(cartId)
      if (errorFound) return next(errorFound)
    }

    return next()
  }

  async create(req: Request, res: Response, next: NextFunction) {
    const { cartId, payload } = req.body
    try {
      return res.json(await OrdersService.create(cartId, payload))
    } catch (error) {
      return next(error)
    }
  }

  async validatePay(req: Request, res: Response, next: NextFunction) {
    const schema: JTDSchemaType<IOrderPayment> = {
      properties: {
        method: { type: "string" },
        paymentNumber: { type: "string" },
        totalPayed: { type: "float64" },
      }
    }

    const validate = new Ajv().compile<IOrderPayment>(schema)
    if (!validate(req.body))
      return next(new SchemaValidationException("Category", schema, validate.errors))


    return next()
  }

  async pay(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params

    try {
      return res.json(await OrdersService.pay(id, req.body))
    } catch (error) {
      return next(error)
    }
  }

  async validateUpdateInfo(req: Request, res: Response, next: NextFunction) {
    const schema: JTDSchemaType<Omit<IOrderNew, "cartId">> = {
      properties: {
        payload: {
          properties: {
            address: {
              properties: { street: { type: "string" }, },
            },
            email: { type: "string" },
            phone: { type: "string" },
          },
        }
      }
    }

    const validate = new Ajv().compile<Omit<IOrderNew, "cartId">>(schema)
    if (!validate(req.body))
      return next(new SchemaValidationException("Category", schema, validate.errors))

    return next()
  }

  async updateInfo(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params
    const { payload } = req.body

    try {
      return res.json(await OrdersService.update(id, payload))
    } catch (error) {
      return next(error)
    }
  }

  async cancell(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params

    try {
      return res.json(await OrdersService.cancell(id))
    } catch (error) {
      return next(error)
    }
  }

  validateMongoId(req: Request, res: Response, next: NextFunction) {
    const { id, variantId } = req.params
    let errorFlag = null
    if (id) {
      errorFlag = isValidMongoId(id)
    }
    if (variantId) {
      errorFlag = isValidMongoId(variantId)
    }
    return next(errorFlag)
  }
}

export default new OrdersController
