import { IOrderNew } from "@models/entities/orders/orders.interface";

export const mockOrders = (carts: any) => {
  const orders: IOrderNew[] = [
    {
      cartId: carts[0]._id,
      payload: {
        address: {
          street: "St. Street",
          streetNumber: "123",
          CP: "2000",
        },
        contactName: "Juancito",
        email: "juanswagner@gmail.com",
        phone: "+5493416559542",
      },
    },
    {
      cartId: carts[1]._id,
      payload: {
        address: {
          street: "Anderson Jeffrey",
          streetNumber: "57A3",
          CP: "2040",
        },
        contactName: "Juancito",
        email: "juanswagner@gmail.com",
        phone: "+5493416559542",
      },
    },
  ];

  return orders
}

export const mockPay = {
  method: "cash",
  paymentNumber: "ij32k4h",
  totalPayed: 156.52,
};
