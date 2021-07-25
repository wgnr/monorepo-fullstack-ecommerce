import { PopulatedDoc, Document } from "mongoose";
import { IVariants } from "@models/entities/variants/variants.interfaces"

export enum CartStatus {
  // The only state to add or remove products
  OPEN = "OPEN",
  IN_CHECKOUT = "IN_CHECKOUT",
  PURCHASED = "PURCHASED",
  CANCELLED = "CANCELLED",
}

export interface ICartAddItem {
  variantId: string;
  quantity: number;
  comment?: string;
}

// Model interface
export interface ICartItem {
  variant: PopulatedDoc<IVariants & Document>;
  quantity: number;
  comment?: string;
}

export interface ICart {
  variants: ICartItem[],
  status: CartStatus,
  user: string;
}
