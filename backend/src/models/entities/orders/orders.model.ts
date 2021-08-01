import { nanoid } from 'nanoid/non-secure'
export const collectionName = "order"
import { Model, model, Schema } from "mongoose"
import { IOrder, OrderStatus, } from "@models/entities/orders/orders.interface"

const ordersSchema = new Schema<IOrder>({
  cart: {
    type: Schema.Types.ObjectId,
    ref: "cart" //ProductsCollectionName,
  },
  details: [String],
  orderNumber: {
    type: String,
    default: () => `${(new Date).toISOString().slice(2, 10)}-${nanoid(10)}`
  },
  payload: {},
  payment: {},
  status: {
    type: String,
    enum: Object.values(OrderStatus),
    default: OrderStatus.AWAITING_PAYMENT
  },
  total: Number,
  user: String, // TODO usar la referenca de mongo
}, {
  versionKey: false,
  timestamps: true
})

export const OrdersModel: Model<IOrder> = model<IOrder>(
  collectionName,
  ordersSchema
)