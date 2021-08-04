import { Request, Response, NextFunction } from "express";
import Ajv, { JTDSchemaType } from "ajv/dist/jtd"
import { JWTController } from "@auth/index";
import { isValidMongoId } from "@models/index";
import { IUser, IUserDocument, IUserNewPublic, UserType } from "@models/entities/users/users.interface";
import { IUserUpdate, IUserNew, IUserUpdatePassword } from "@models/entities/users/users.interface";
import { SchemaValidationException, ValidationException } from "@exceptions/index"
import UsersService from "@services/users"

class UsersController extends JWTController {
  async selfResource(req: Request, res: Response, next: NextFunction): Promise<void> {
    const user = (req.user) as IUser
    const { params: { userId } } = req

    if (req.isUnauthenticated())
      return next("Unauthenticated")

    if (JWTController.isAdmin(user)) {
      res.locals.isAdmin = { ...res.locals, isAdmin: true }
      return next()
    }

    const { _id } = (req.user) as IUserDocument

    if (String(_id) !== userId) {
      return next("Unauthorise")
    }

    return next()
  }

  async getAllOrById(req: Request, res: Response, next: NextFunction) {
    const { userId } = req.params
    const { email } = req.query
    const { isAdmin = false } = res.locals
    let response

    try {
      if (isAdmin) {
        if (userId) {
          response = await UsersService.getById(userId)
        } else if (typeof email === "string") {
          response = await UsersService.getByEmail(email)
        } else {
          response = await UsersService.getAll()
        }
      } else {
        response = await UsersService.getById(userId)
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
      },
      optionalProperties: {
        type: { enum: Object.values(UserType) }
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

  validateCreatePublic(req: Request, res: Response, next: NextFunction) {
    const user: IUserNewPublic = req.body

    const schema: JTDSchemaType<IUserNewPublic> = {
      properties: {
        email: { type: "string" },
        firstName: { type: "string" },
        lastName: { type: "string" },
        password: { type: "string", },
      }
    }

    const validate = new Ajv().compile<IUserNewPublic>(schema)
    if (!validate(user))
      return next(new ValidationException(
        validate.errors?.join("/n") ?? "Can validate create user payload."
      ))

    if (!UsersService.validatePassword(user.password))
      return next(new ValidationException("Password must have at least 8 alphanumric characters"))

    return next()
  }

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
    const { userId } = req.params
    try {
      return res.json(await UsersService.update(userId, req.body));
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
    const { userId } = req.params
    try {
      return res.json(await UsersService.updatePassword(userId, req.body));
    } catch (error) {
      return next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    const { userId } = req.params
    try {
      return res.json(await UsersService.delete(userId));
    } catch (error) {
      return next(error);
    }
  }

  validateMongoId(req: Request, res: Response, next: NextFunction) {
    const { userId } = req.params
    let errorFlag = null
    if (userId) {
      errorFlag = isValidMongoId(userId)
    }
    return next(errorFlag)
  }

}

export default new UsersController