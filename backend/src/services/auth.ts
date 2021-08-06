import { sign } from "jsonwebtoken"
import { GlobalVars } from "@config/index";
import UsersDTO from "@models/entities/users/users.dto"
import UsersService from "@services/users"
import { IUserDocument, IUserNewPublic } from "@models/entities/users/users.interface";

const { auth: { jwt: { JWT_TOKEN_SECRET, JWT_EXPIRATION_TIME } } } = GlobalVars

class AuthService {
  async generateToken(sub: string) {
    return await sign({}, JWT_TOKEN_SECRET, {
      // https://github.com/vercel/ms
      expiresIn: JWT_EXPIRATION_TIME,
      subject: sub,
      algorithm: 'HS512',
    })
  }

  async createPublicUser(user: IUserNewPublic) {
    const newUser = await UsersService.createPublic(user) as IUserDocument
    return UsersDTO.returnOne(newUser)
  }
}

export default new AuthService
