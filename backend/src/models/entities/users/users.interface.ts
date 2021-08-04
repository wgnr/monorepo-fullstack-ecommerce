import { Document, PopulatedDoc, } from "mongoose"
import { ICart } from "@models/entities/carts/carts.interface";

export enum UserType {
  USER = "USER",
  ADMIN = "ADMIN"
}

export interface IUserUpdate {
  firstName?: string;
  lastName?: string;
}

export interface IUserUpdatePassword {
  password: string;
}

interface IUserBase {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  type?: UserType;
}

export interface IUserNewPublic extends Omit<IUserBase, "type"> { }

export interface IUserNew extends IUserBase { }

export interface IUserNewFacebook extends Omit<Omit<IUserBase, "password">, "email"> {
  email?: string;
  // firstName?: string;
  type: UserType.USER;
  social?: {
    facebook?: {
      email: string;
      username?: string;
    };
  };
}

export interface IUser extends Omit<Omit<IUserBase, "password">, "email"> {
  email?: string;
  password?: string;
  currentCart?: string;
  type?: UserType;
  social?: {
    facebook?: {
      email: string;
      username?: string;
    };
  };
}

export interface IUserDocument extends Omit<IUser, "password">, Document {
  currentCart: PopulatedDoc<ICart & Document>;
  password?: string;
}