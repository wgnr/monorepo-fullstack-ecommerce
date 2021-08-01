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
}

export interface IUserNew extends IUserBase { }

export interface IUser extends IUserBase {
  currentCart?: string;
  type?: UserType;
}

export interface IUserDocument extends Omit<IUser, "password">, Document {
  currentCart: PopulatedDoc<ICart & Document>;
  password?: string;
}