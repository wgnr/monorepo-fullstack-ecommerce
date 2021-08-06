import { LeanDocument } from "mongoose";
import { Request, Response, NextFunction } from "express";
import { JWTController } from "@auth/index";
import { isValidMongoId } from "@models/index";
import { IUserDocument } from "@models/entities/users/users.interface";
import ChatsServices from "@services/chat"

class ChatsControllers extends JWTController {
  selfResource(req: Request, res: Response, next: NextFunction): void {
    const user = (req.user) as LeanDocument<IUserDocument>
    const { params: { userId } } = req

    if (req.isUnauthenticated())
      return next("Unauthenticated")

    if (JWTController.isAdmin(user)) {
      res.locals.isAdmin = { ...res.locals, isAdmin: true }
      return next()
    }

    if (String(user._id) !== userId)
      return next("That's not yours.")

    return next()
  }

  async getChat(req: Request, res: Response, next: NextFunction) {
    const { params: { userId } } = req
    try {
      return res.json(await ChatsServices.getByUserId(userId))
    } catch (error) {
      return next(error)
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

export default new ChatsControllers
