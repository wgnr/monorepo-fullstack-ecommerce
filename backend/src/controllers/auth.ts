import { Request, Response, NextFunction } from "express";
import { StrategiesController } from '@auth/index'
import { IUserDocument, IUserNewPublic } from "@models/entities/users/users.interface";
import AuthServices from "@services/auth"
import UsersControllers from "@controllers/users"

class AuthControllers extends StrategiesController {
  selfResource(req: Request, res: Response, next: NextFunction) {
    return next()
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { _id: userId } = req.user as IUserDocument
      const token = await AuthServices.generateToken(String(userId))
      return res.json({ token })
    } catch (error) {
      return next(error);
    }
  }

  validatePublicSignup(req: Request, res: Response, next: NextFunction) {
    return UsersControllers.validateCreatePublic(req, res, next)
  }

  async publicSignup(req: Request, res: Response, next: NextFunction) {
    try {
      const user: IUserNewPublic = req.body
      return res.status(201).json(await AuthServices.createPublicUser(user))
    } catch (error) {
      return next(error);
    }
  }
}

export default new AuthControllers
