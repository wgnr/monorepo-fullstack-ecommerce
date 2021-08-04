import "@auth/jwt/passport-jwt"
import { Request, Response, NextFunction } from "express";
import passport, { AuthenticateOptions } from "passport";
import { IUser, UserType } from "@models/entities/users/users.interface";

export abstract class JWTController {
  // Only owner of the resource can access
  abstract selfResource(req: Request, res: Response, next: NextFunction): void;

  static isAdmin(user: IUser): boolean {
    return user.type === UserType.ADMIN
  }

  adminOnly(req: Request, res: Response, next: NextFunction) {
    return JWTController.adminOnly(req, res, next)
  }

  static adminOnly(req: Request, res: Response, next: NextFunction) {
    if (req.isUnauthenticated())
      return next("Admin only")

    const user = req.user as IUser

    if (!JWTController.isAdmin(user)) {
      res.locals.isAdmin = { ...res.locals, isAdmin: true }
      return next("Admin only")
    }

    return next()
  }

  static authenticate() {
    const options: AuthenticateOptions = {
      session: false,
      failWithError: true,
    }

    return passport.authenticate('jwt', options)
  }
}
