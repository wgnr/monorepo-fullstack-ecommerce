import { ClientSession, QueryOptions } from "mongoose"
import CommonDAO from "@models/entities/CommonDAO"
import { IUser, IUserUpdate } from "@models/entities/users/users.interface"
import { UsersModel } from "@models/entities/users/users.model"

class UsersDAO extends CommonDAO<IUser>{
  constructor() {
    super(UsersModel)
  }

  async getOneByEmail(email: string) {
    this.mongoDebug("getOneByEmail", { email })

    return await this.model.findOne({ email })
      .orFail(this.throwNotFoundError({ email }))
  }

  async assignNewCart(userId: string, cartId: string, session: ClientSession) {
    this.mongoDebug("assignNewCart", { userId, cartId })

    const options: QueryOptions = { session, new: true }
    return await this.model.updateOne(
      { _id: userId },
      { currentCart: cartId },
      options
    )
      .orFail(this.throwNotFoundError({ userId }))

  }

  async updateInfoById(userId: string, payload: IUserUpdate) {
    this.mongoDebug("updateInfoById", { userdId: userId, payload })

    return await this.model.findByIdAndUpdate(
      userId,
      { $set: payload },
      { new: true }
    )
      .orFail(this.throwNotFoundError({ userId }))
  }

  async deleteUser(id: string) {
    this.mongoDebug("deleteUser", { id })

    return await this.model.findByIdAndUpdate(id, {
      deletedAt: new Date
    })
      .orFail(this.throwNotFoundError({ id }))

  }
}

export default new UsersDAO
