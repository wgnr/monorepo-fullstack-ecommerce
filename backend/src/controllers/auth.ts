import { Request, Response, NextFunction } from "express";
import { sign } from "jsonwebtoken"
import { AuthJWT } from '@auth/index'
import { GlobalVars } from "@config/index";

const { jwt: { JWT_TOKEN_SECRET, JWT_EXPIRATION_TIME } } = GlobalVars

class AuthControllers extends AuthJWT {
  selfResource(req: Request, res: Response, next: NextFunction) {
    return next()
  }

  login(req: Request, res: Response, next: NextFunction) {
    const token = sign({}, JWT_TOKEN_SECRET, {
      // https://github.com/vercel/ms
      expiresIn: JWT_EXPIRATION_TIME,
      subject: "6106f48f8477be391049fb94",
    })
    return res.json({ token })
  }
  logout(req: Request, res: Response, next: NextFunction) { }

  signup(req: Request, res: Response, next: NextFunction) { }
}

export default new AuthControllers
