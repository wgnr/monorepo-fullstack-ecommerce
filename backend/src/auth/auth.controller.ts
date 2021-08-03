import { Request, Response, NextFunction } from "express";
import passport from "passport"
import { IUser, UserType } from "@models/entities/users/users.interface";

export abstract class AuthJWT {
  // Only owner of the resource can access
  abstract selfResource(req: Request, res: Response, next: NextFunction): void;

  static isAdmin(user: IUser): boolean {
    return user.type === UserType.ADMIN
  }

  adminOnly(req: Request, res: Response, next: NextFunction) {
    return AuthJWT.adminOnly(req, res, next)
  }

  static adminOnly(req: Request, res: Response, next: NextFunction) {
    if (req.isUnauthenticated())
      return next("Admin only")

    const user = req.user as IUser

    if (!AuthJWT.isAdmin(user)) {
      res.locals.isAdmin = { ...res.locals, isAdmin: true }
      return next("Admin only")
    }

    return next()
  }

  static verifyJWT() {
    return passport.authenticate('jwt', { session: false })
  }
}
