import { SendMailOptions } from "nodemailer";
import { IOrderDocument } from "@models/entities/orders/orders.interface";
import { sendMail } from "@utils/email/index";

const orderEmailBody = (order: IOrderDocument) => {
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
  `;
};

export const sendOrderSummary = async (order: IOrderDocument) => {
  const { email } = order.payload!;
  if (!email) {
    console.error(`No email address was provided for the order ${order.orderNumber}`);
    return;
  }

  const emailOptions: SendMailOptions = {
    to: email,
    subject: `Your purchase has been completed! Purchase Order #: ${order.orderNumber}`,
    html: orderEmailBody(order),
  };

  try {
    await sendMail(emailOptions);
    console.log(`Order ${order.orderNumber} sent to ${email} successfully.`);
  } catch (err) {
    console.error(`There was an error sending the order ${order.orderNumber} to ${email}`);
  }
};
