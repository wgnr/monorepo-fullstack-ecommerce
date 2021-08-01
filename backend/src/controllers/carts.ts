import Ajv, { JTDSchemaType } from "ajv/dist/jtd"
import { Request, Response, NextFunction } from "express";
import CartsService from "@services/cart"
import { SchemaValidationException, ValidationException } from "@exceptions/index";
import { ICartAddItem } from "@models/entities/carts/carts.interface"
import { isValidMongoId } from "@models/index";

class CartsControllers {
  async getOneOrAll(req: Request, res: Response, next: NextFunction) {
    const { query: { status } } = req
    const { params: { id } } = req
    let response

    try {
      if (id) {
        response = await CartsService.getById(id)
      } else if (typeof status === "string") {
        response = await CartsService.getByStatus(status)
      } else {
        response = await CartsService.getAll()
      }
      return res.json(response)
    } catch (error) {
      return next(error)
    }
  }

  async validateAddOrUpdateVariant(req: Request, res: Response, next: NextFunction) {
    const items: ICartAddItem[] = req.body

    const schema: JTDSchemaType<ICartAddItem[]> = {
      elements: {
        properties: {
          variantId: { type: "string" },
          quantity: { type: "int32", },
        },
        optionalProperties: {
          comment: { type: "string" }
        }
      }
    }

    const validate = new Ajv().compile<ICartAddItem[]>(schema)
    if (!validate(items))
      return next(new SchemaValidationException("Category", schema, validate.errors))

    for (const item of items) {
      const errorFound = isValidMongoId(item.variantId)
      if (errorFound) return next(errorFound)
      if (!(item.quantity > 0)) return next(new ValidationException(`Item ${item.variantId} quantity must be possite. Current value ${item.quantity}`))
    }

    return next()
  }

  async addOrUpdateVariant(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params
    const items: ICartAddItem[] = req.body

    try {
      return res.json(await CartsService.upsertProducts(id, items))
    } catch (error) {
      return next(error)
    }
  }

  async removeVariant(req: Request, res: Response, next: NextFunction) {
    const { id, variantId } = req.params
    try {
      return res.json(await CartsService.removeVariant(id, variantId))
    } catch (error) {
      return next(error)
    }
  }
  async clear(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params
    try {
      return res.json(await CartsService.clear(id))
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

export default new CartsControllers
