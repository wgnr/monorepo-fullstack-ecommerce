import Ajv, { JTDSchemaType } from "ajv/dist/jtd"
import { Request, Response, NextFunction } from "express";
import { JWTController } from "@auth/index";
import { ICategoryNew, ICategoryAddProduct } from "@models/entities/categories/categories.interfaces"
import { isValidMongoId } from "@models/index"
import { IUser } from "@models/entities/users/users.interface";
import { SchemaValidationException } from "@exceptions/index";
import CategoryService from "@services/categories"


class CategoriesControllers extends JWTController {
  selfResource(req: Request, res: Response, next: NextFunction): void {
    const user = (req.user) as IUser
    const { params: { cartId } } = req

    if (req.isUnauthenticated())
      return next("Unauthenticated")

    if (JWTController.isAdmin(user)) {
      res.locals.isAdmin = { ...res.locals, isAdmin: true }
      return next()
    }

    if (String(user.currentCart) !== cartId)
      return next("That's not yours.")

    return next()
  }

  async getOneOrALl(req: Request, res: Response, next: NextFunction) {
    const { query: { name } } = req
    const { params: { categoryId } } = req
    let response

    try {
      if (categoryId) {
        response = await CategoryService.getById(categoryId)
      } else if (typeof name === "string") {
        response = await CategoryService.getOneByName(name)
      } else {
        response = await CategoryService.getAll()
      }

      return res.json(response)
    } catch (error) {
      return next(error)
    }
  }

  validateCreate(req: Request, res: Response, next: NextFunction) {
    const schema: JTDSchemaType<ICategoryNew> = {
      properties: {
        name: { type: "string" },
      },
      optionalProperties: {
        products: {
          elements: { type: "string" }
        }
      }
    }

    const validate = new Ajv().compile<ICategoryNew>(schema)
    if (!validate(req.body))
      return next(new SchemaValidationException("Category", schema, validate.errors))

    const { products } = req.body;
    if (products) {
      for (const productId of products) {
        const errorFound = isValidMongoId(productId)
        if (errorFound) return next(errorFound)
      }
    }

    return next()
  }

  async create(req: Request, res: Response, next: NextFunction) {
    const { body } = req

    try {
      return res.json(await CategoryService.create(body))
    } catch (error) {
      return next(error)
    }
  }

  validateAddOrRemoveProduct(req: Request, res: Response, next: NextFunction) {
    const schema: JTDSchemaType<ICategoryAddProduct> = {
      properties: {
        products: {
          elements: { type: "string" }
        }
      },
    }

    const validate = new Ajv().compile<ICategoryAddProduct>(schema)
    if (!validate(req.body))
      return next(new SchemaValidationException("Category", schema, validate.errors))

    const { products } = req.body;
    if (products) {
      for (const productId of products) {
        const errorFound = isValidMongoId(productId)
        if (errorFound) return next(errorFound)
      }
    }

    return next()
  }

  async addOrDeleteProducts(req: Request, res: Response, next: NextFunction) {
    const { categoryId } = req.params
    const { products } = req.body

    try {
      let response
      if (req.method === "POST") {
        response = await CategoryService.addProducts(categoryId, products)
      } else if (req.method === "DELETE") {
        response = await CategoryService.removeProducts(categoryId, products)
      } else {
        return res.end()
      }
      return res.json(response)
    } catch (error) {
      return next(error)
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    const { categoryId } = req.params
    try {
      return res.json(await CategoryService.delete(categoryId))
    } catch (error) {
      return next(error)
    }
  }

  validateMongoId(req: Request, res: Response, next: NextFunction) {
    const { categoryId } = req.params
    return next(categoryId && isValidMongoId(categoryId))
  }
}

export default new CategoriesControllers
