import { PopulatedDoc, Document } from "mongoose";
import { ICart } from "@models/entities/carts/carts.interface";

export enum OrderStatus {
  AWAITING_PAYMENT = "AWAITING_PAYMENT",
  CANCELLED = "CANCELLED",
  COMPLETED = "COMPLETED",
  // PURCHASED_WITH_MISSINGS = "PURCHASED_WITH_MISSINGS",
}

export interface IOrderNew {
  cartId: string;
  payload: IOrderPayload;
}

// Model Interfaces
export interface IOrderPayload {
  address: {
    street: string;
    streetNumber: string;
    CP: string;
    other?: string;
  };
  contactName: string;
  email: string;
  phone: string;
}

export interface IOrderPayment {
  method: string;
  paymentNumber: string;
  totalPayed: number;
}

export interface IOrder {
  cart: string;
  details?: string[];
  orderNumber?: number;
  payload?: IOrderPayload;
  payment?: IOrderPayment;
  status: OrderStatus;
  total: number;
  user: string;
}

export interface IOrderDocument extends Omit<IOrder, "cart">, Document {
  cart: PopulatedDoc<ICart & Document>;
  createdAt: Date;
  updatedAt: Date;
}
