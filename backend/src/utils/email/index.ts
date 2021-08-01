import { createTransport, SendMailOptions } from "nodemailer";
import { orderEmailBody } from "@utils/email/orderTemplate"
import { GlobalVars } from "@config/index"
import { IOrderDocument } from "@models/entities/orders/orders.interface";

const {
  email: {
    GMAIL_USERNAME,
    GMAIL_PASSWORD,
    GMAIL_OAUTH_CLIENTID,
    GMAIL_OAUTH_CLIENT_SECRET,
    GMAIL_OAUTH_REFRESH_TOKEN,

  },
  debug: {
    SEND_BCC,
    BCC_DEBUG_EMAIL
  }
} = GlobalVars

// Source: https://www.freecodecamp.org/news/use-nodemailer-to-send-emails-from-your-node-js-server/
const transporter = createTransport({
  // @ts-ignore
  service: "gmail",
  auth: {
    type: "OAuth2",
    user: GMAIL_USERNAME,
    pass: GMAIL_PASSWORD,
    clientId: GMAIL_OAUTH_CLIENTID,
    clientSecret: GMAIL_OAUTH_CLIENT_SECRET,
    refreshToken: GMAIL_OAUTH_REFRESH_TOKEN,
  },
  tls: {
    rejectUnauthorized: false
  }
});

const sendMail = async (options: SendMailOptions) => {
  await transporter.sendMail({
    ...options,
    ...(SEND_BCC ? { bcc: BCC_DEBUG_EMAIL } : {})
  })
}

export const testEmailService = async (email: string) => {
  try {
    await sendMail({
      to: email,
      subject: `TEST | #{new Date}`,
      text: `Test  ${new Date().toISOString()}`
    })
    console.log(`Email sent to ${email} successfully.`)
  } catch (err) {
    console.error(`There was an error sengind an email to ${email}`)
  }
}

export const sendOrderSummary = async (order: IOrderDocument) => {
  const { email } = order.payload!
  if (!email) {
    console.error(`No email address was provided for the order ${order.orderNumber}`)
    return
  }

  const emailOptions: SendMailOptions = {
    to: email,
    subject: `Your purchase has been completed! Purchase Order #: ${order.orderNumber}`,
    html: orderEmailBody(order)
  }

  try {
    await sendMail(emailOptions)
    console.log(`Order ${order.orderNumber} sent to ${email} successfully.`)
  } catch (err) {
    console.error(`There was an error sengind the the order ${order.orderNumber} to ${email}`)
  }
}