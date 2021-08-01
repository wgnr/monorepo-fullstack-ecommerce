import { IOrderDocument } from "@models/entities/orders/orders.interface";

export const orderEmailBody = (order: IOrderDocument) => {
  const { total, orderNumber, details, updatedAt } = order;

  return `
    <div>
      <h2>Order Summary</h2>
      <span>Order #: </span><span>${orderNumber}</span><br>
      <span>Total: $</span><span>${total}</span><br>
      <span>Date: </span><span>${updatedAt}</span><br>
      <h3>Products</h3>
      <ul>
        ${details?.map(item => `<li>${item}</li>`).join("")}
      </ul>
    </div>
  `
}