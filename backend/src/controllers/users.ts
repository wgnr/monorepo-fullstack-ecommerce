import { Request, Response, NextFunction } from "express";
import Ajv, { JTDSchemaType } from "ajv/dist/jtd"
import { IProductNew, IProductBase } from "@models/entities/products/products.interfaces"
import UsersService from "@services/users"
import { SchemaValidationException, ValidationException } from "@exceptions/index"
import { isValidMongoId } from "@models/index";
import { IVariantBase, IVariantUpdate } from "@models/entities/variants/variants.interfaces";
import { IUserUpdate, IUserNew, IUserUpdatePassword } from "@models/entities/users/users.interface";

class UsersController {
  async getAllOrById(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params
    const { email } = req.query
    let response

    try {
      if (id) {
        response = await UsersService.getById(id)
      } else if (typeof email === "string") {
        response = await UsersService.getByEmail(email)
      } else {
        response = await UsersService.getAll()
      }
      return res.json(response)
    } catch (error) {
      return next(error)
    }
  }

  async validateCreate(req: Request, res: Response, next: NextFunction) {
    const user: IUserNew = req.body

    const schema: JTDSchemaType<IUserNew> = {
      properties: {
        email: { type: "string" },
        firstName: { type: "string" },
        lastName: { type: "string" },
        password: { type: "string", },
      }
    }

    const validate = new Ajv().compile<IUserNew>(schema)
    if (!validate(user))
      return next(new SchemaValidationException("Create user", schema, validate.errors))

    if (!UsersService.validatePassword(user.password)) {
      return next(new ValidationException("Password must have at least 8 alphanumric characters"))
    }

    return next()
  };

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      return res.json(await UsersService.create(req.body));
    } catch (error) {
      return next(error);
    }
  };


  async validateUpdate(req: Request, res: Response, next: NextFunction) {
    const payload: IUserUpdate = req.body

    const schema: JTDSchemaType<IUserUpdate> = {
      optionalProperties: {
        firstName: { type: "string" },
        lastName: { type: "string" },
      }
    }

    const validate = new Ajv().compile<IUserUpdate>(schema)
    if (!validate(payload))
      return next(new SchemaValidationException("Update user", schema, validate.errors))

    return next()
  };

  async update(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params
    try {
      return res.json(await UsersService.update(id, req.body));
    } catch (error) {
      return next(error);
    }
  }

  async validateUpdatePassword(req: Request, res: Response, next: NextFunction) {
    const payload: IUserUpdatePassword = req.body

    const schema: JTDSchemaType<IUserUpdatePassword> = {
      properties: {
        password: { type: "string" },
      }
    }

    const validate = new Ajv().compile<IUserUpdatePassword>(schema)
    if (!validate(payload))
      return next(new SchemaValidationException("Update password", schema, validate.errors))

    if (!UsersService.validatePassword(payload.password)) {
      return next(new ValidationException("Password must have at least 8 alphanumric characters"))
    }

    return next()
  };

  async updatePassword(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params
    try {
      return res.json(await UsersService.updatePassword(id, req.body));
    } catch (error) {
      return next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params
    try {
      return res.json(await UsersService.delete(id));
    } catch (error) {
      return next(error);
    }
  }

  validateMongoId(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params
    let errorFlag = null
    if (id) {
      errorFlag = isValidMongoId(id)
    }
    return next(errorFlag)
  }

}

export default new UsersController