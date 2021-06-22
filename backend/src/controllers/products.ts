import { Request, Response, NextFunction } from "express";
import Ajv, { JTDSchemaType } from "ajv/dist/jtd"
import { INewProduct } from "@models/products"
import { createProduct, getAllProducts } from "@services/products"


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

  const validate = new Ajv().compile(schema)
  if (!validate(req.body)) throw validate.errors

  return next()
};