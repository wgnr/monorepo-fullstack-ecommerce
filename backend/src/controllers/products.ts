import { Request, Response, NextFunction } from "express";
import Ajv, { JTDSchemaType } from "ajv/dist/jtd"
import { IProduct } from "@models/products"


export const getAll = (req: Request, res: Response) => {
  res.json({});
};

export const createOne = (req: Request, res: Response) => {
  res.json({});
};

export const createOneMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const schema: JTDSchemaType<IProduct> = {
    properties: {
      id: { type: "string" },
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