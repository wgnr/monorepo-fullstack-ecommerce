import { IUserDocument } from "@models/entities/users/users.interface";

class UsersDTO {
  returnOne(user: IUserDocument) {
    user.password = undefined;
    return user;
  }

  returnMany(users: IUserDocument[]) {
    return users.map(this.returnOne);
  }
}

export default new UsersDTO();
