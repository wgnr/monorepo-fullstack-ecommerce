import { Request, Response, NextFunction } from "express";
import Ajv, { JTDSchemaType } from "ajv/dist/jtd"
import { INewProduct } from "@models/products"
import { createProduct, getAllProducts } from "@services/products"
import ValidationException from "@exceptions/ValidationException"


export const getAll = async (req: Request, res: Response) => {
  const products = await getAllProducts()
  res.json(products);
};

export const createOne = async (req: Request, res: Response) => {
  const newProduct = await createProduct(req.body);
  res.json(newProduct);
};

export const createOneMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const schema: JTDSchemaType<INewProduct> = {
    properties: {
      name: { type: "string" },
    },
    optionalProperties: {
      price: { type: "int8" }
    }
  }

  const validate = new Ajv().compile<INewProduct>(schema)
  if (!validate(req.body))
    return next(new ValidationException("create new product", schema, validate.errors))

  return next()
};