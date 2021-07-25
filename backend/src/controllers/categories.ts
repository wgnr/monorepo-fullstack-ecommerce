import Ajv, { JTDSchemaType } from "ajv/dist/jtd"
import { Request, Response, NextFunction } from "express";
import CategoryService from "@services/categories"
import { ICategoryNew, ICategoryAddProduct } from "@models/entities/categories/categories.interfaces"
import { SchemaValidationException } from "@exceptions/index";
import { isValidMongoId } from "@models/index"



class CategoriesControllers {
  async getOneOrALl(req: Request, res: Response, next: NextFunction) {
    const { query: { name } } = req
    const { params: { id } } = req
    let response

    try {
      if (id) {
        response = await CategoryService.getById(id)
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
    const { id } = req.params
    const { products } = req.body

    try {
      let response
      if (req.method === "POST") {
        response = await CategoryService.addProducts(id, products)
      } else if (req.method === "DELETE") {
        response = await CategoryService.removeProducts(id, products)
      } else {
        return res.end()
      }
      return res.json(response)
    } catch (error) {
      return next(error)
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params
    try {
      return res.json(await CategoryService.delete(id))
    } catch (error) {
      return next(error)
    }
  }

  validateMongoId(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params
    return next(id && isValidMongoId(id))
  }
}

export default new CategoriesControllers
