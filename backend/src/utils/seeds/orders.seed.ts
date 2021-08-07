export const mockOrders = (carts: any) => [
  {
    cartId: carts[0]._id,
    payload: {
      address: {
        street: "calle 123",
      },
      email: "juanswagner@gmail.com",
      phone: "+5493416559542",
    },
  },
  {
    cartId: carts[1]._id,
    payload: {
      address: {
        street: "Otra diraccion",
      },
      email: "juanswagner@gmail.com",
      phone: "+5493416559542",
    },
  },
];

export const mockPay = {
  method: "cash",
  paymentNumber: "ij32k4h",
  totalPayed: 156.52,
};
