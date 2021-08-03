import { Request, Response, NextFunction } from "express";
import Ajv, { JTDSchemaType } from "ajv/dist/jtd"
import { AuthJWT } from "@auth/index";
import { IProductNew, IProductBase } from "@models/entities/products/products.interfaces"
import { isValidMongoId } from "@models/index";
import { IUser, IUserDocument } from "@models/entities/users/users.interface";
import { IVariantBase, IVariantUpdate } from "@models/entities/variants/variants.interfaces";
import { SchemaValidationException, ValidationException } from "@exceptions/index"
import ProductService from "@services/products"

class ProductController extends AuthJWT {
  selfResource(req: Request, res: Response, next: NextFunction) {
    return next()
  }

  async getAllOrById(req: Request, res: Response, next: NextFunction) {
    const { productId } = req.params
    const { category } = req.query
    let response

    try {
      if (productId) {
        response = await ProductService.getById(productId)
      } else if (typeof category === "string") {
        response = await ProductService.getByCategoryName(category)
      } else {
        response = await ProductService.getAll()
      }
      return res.json(response)
    } catch (error) {
      return next(error)
    }
  }

  async getVariantById(req: Request, res: Response, next: NextFunction) {
    const { variantId } = req.params

    try {
      return res.json(await ProductService.getVariantPopulatedByVariantId(variantId))
    } catch (error) {
      return next(error)
    }
  }

  async getVariantPopulatedByProductId(req: Request, res: Response, next: NextFunction) {
    const { productId } = req.params
    try {
      return res.json(await ProductService.getPopulatedByProductId(productId));
    } catch (error) {
      return next(error)
    }
  }

  async validateCreateProducts(req: Request, res: Response, next: NextFunction) {
    const products: IProductNew[] = req.body

    if (products?.length === 0)
      return next(new ValidationException("products is empty!"))

    const schema: JTDSchemaType<IProductNew[]> = {
      elements: {
        properties: {
          name: { type: "string" },
          price: { type: "float32" },
        },
        optionalProperties: {
          categories: { elements: { type: "string" } },
          description: { type: "string" },
          img: { type: "string" },
          slug: { type: "string" },
          variants: {
            elements: {
              properties: { stock: { type: "int32" } },
              optionalProperties: { options: { elements: { type: "string" } } }
            }
          }
        }
      }
    }

    const validate = new Ajv().compile<IProductNew[]>(schema)
    if (!validate(products))
      return next(new SchemaValidationException("products array", schema, validate.errors))

    const categorieIdsArr = [...new Set(
      products
        .filter(
          ({ categories }) =>
            Array.isArray(categories) &&
            categories.length > 0
        )
        .flatMap(product => product.categories)
    )] as string[]

    for (const categoryId of categorieIdsArr) {
      const errorFound = isValidMongoId(categoryId)
      if (errorFound) return next(errorFound)
    }

    const optionsValueIdsArr = [...new Set(
      products
        .filter(
          ({ variants }) =>
            Array.isArray(variants) &&
            variants.length > 0
        )
        .flatMap(
          ({ variants }) => variants?.flatMap(variant => variant?.options)
        )
    )] as string[]

    for (const optionId of optionsValueIdsArr) {
      const errorFound = isValidMongoId(optionId)
      if (errorFound) return next(errorFound)
    }

    return next()
  };

  async create(req: Request, res: Response, next: NextFunction) {
    const products: IProductNew[] = req.body
    try {
      return res.json(await ProductService.createProducts(products));
    } catch (error) {
      return next(error)
    }
  };

  async validateAddVariant(req: Request, res: Response, next: NextFunction) {
    const variants = req.body as IVariantBase

    const schema: JTDSchemaType<IVariantBase> = {
      properties: { stock: { type: "int32" }, },
      optionalProperties: { options: { elements: { type: "string" } } }
    }

    const validate = new Ajv().compile<IVariantBase>(schema)
    if (!validate(variants))
      return next(new SchemaValidationException("products array", schema, validate.errors))

    const { options } = variants
    if (options) {
      for (const optionId of options) {
        const errorFound = isValidMongoId(optionId)
        if (errorFound) return next(errorFound)
      }
    }

    return next()
  }


  async addVariant(req: Request, res: Response, next: NextFunction) {
    const { productId } = req.params;
    try {
      return res.json(await ProductService.addVariant(productId, req.body));
    } catch (error) {
      return next(error)
    }
  }



  async validateUpdateProducts(req: Request, res: Response, next: NextFunction) {
    const product = req.body as IProductBase

    const schema: JTDSchemaType<IProductBase> = {
      properties: {
        name: { type: "string" },
        price: { type: "float32" },
      },
      optionalProperties: {
        description: { type: "string" },
        img: { type: "string" },
        slug: { type: "string" },
      }
    }

    const validate = new Ajv().compile<IProductBase>(schema)
    if (!validate(product))
      return next(new SchemaValidationException("products array", schema, validate.errors))

    return next()
  };

  async updateProducts(req: Request, res: Response, next: NextFunction) {
    const { productId } = req.params
    try {
      return res.json(await ProductService.update(productId, req.body));
    } catch (error) {
      return next(error)
    }
  };

  async validateUpdateVariant(req: Request, res: Response, next: NextFunction) {
    const variant = req.body as IVariantUpdate

    const schema: JTDSchemaType<IVariantUpdate> = {
      properties: { stock: { type: "int32" } },
    }

    const validate = new Ajv().compile<IVariantUpdate>(schema)
    if (!validate(variant))
      return next(new SchemaValidationException("products array", schema, validate.errors))

    return next()
  }

  async updateVariant(req: Request, res: Response, next: NextFunction) {
    const { variantId } = req.params
    try {
      return res.json(await ProductService.updateVariant(variantId, req.body));
    } catch (error) {
      return next(error)
    }
  }

  async deleteVariant(req: Request, res: Response, next: NextFunction) {
    const { variantId } = req.params
    try {
      const deletedCount = await ProductService.deleteVariant(variantId)
      return res.status(201).json(deletedCount)
    } catch (error) {
      return next(error)
    }
  };

  async delete(req: Request, res: Response, next: NextFunction) {
    const { productId } = req.params
    try {
      const deletedCount = await ProductService.delete(productId)
      return res.status(201).json(deletedCount)
    } catch (error) {
      return next(error)
    }
  }

  validateMongoId(req: Request, res: Response, next: NextFunction) {
    const { productId, variantId } = req.params
    let errorFlag = null
    if (productId) {
      errorFlag = isValidMongoId(productId)
    }
    if (variantId) {
      errorFlag = isValidMongoId(variantId)
    }
    return next(errorFlag)
  }
}

export default new ProductController