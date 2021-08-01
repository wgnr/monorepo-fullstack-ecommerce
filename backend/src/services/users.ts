import { ClientSession, Types } from "mongoose"
import UsersDAO from "@models/entities/users/users.dao"
import CartsService from "@services/cart"
import { ValidationException } from "@exceptions/index"
import { IUserUpdate, IUserDocument, IUserNew, IUserUpdatePassword } from "@models/entities/users/users.interface"
import UsersDTO from "@models/entities/users/users.dto"


class UsersService {
  async getById(id: string) {
    return UsersDTO.returnOne(await UsersDAO.getOneById(id) as IUserDocument)
  }

  async getAll() {
    return UsersDTO.returnMany(await UsersDAO.getMany() as IUserDocument[])
  }

  async getByEmail(email: string) {
    return UsersDTO.returnOne(await UsersDAO.getOneByEmail(email) as IUserDocument)
  }

  async create(user: IUserNew) {
    if (await this.getByEmail(user.email).catch(e => false))
      throw new ValidationException(`Email already exists: ${user.email}`)

    const newId = Types.ObjectId();
    const newCartId = (await CartsService.create(String(newId)))._id
    const newUser = await UsersDAO.create({
      // @ts-ignore
      _id: newId,
      ...user,
      currentCart: newCartId
    })

    return newUser;
  }

  async assignNewCart(userId: string, session: ClientSession) {
    const newCartId = (await CartsService.create(userId))._id
    await UsersDAO.assignNewCart(userId, newCartId, session)
  }

  async update(id: string, payload: IUserUpdate) {
    return UsersDTO.returnOne(
      await UsersDAO.updateInfoById(id, payload) as IUserDocument
    )
  }

  async updatePassword(id: string, payload: IUserUpdatePassword) {
    const user = await this.getById(id)
    user.password = payload.password
    await user.save()
  }

  async delete(id: string) {
    await UsersDAO.deleteUser(id)
  }

  validatePassword(password: string | undefined) {
    return password ? /^[a-zA-Z0-9]{8,}$/.test(password) : true
  }
}

export default new UsersService
