import { createTransport, SendMailOptions } from "nodemailer";
import { GlobalVars } from "@config/index";
export { sendOrderSummary } from "@utils/email/orderTemplate";
export { sendNewAccountCreated } from "@utils/email/userTempalte";

const {
  email: {
    DISABLE_SEND_EMAILS,
    GMAIL_USERNAME,
    GMAIL_PASSWORD,
    GMAIL_OAUTH_CLIENTID,
    GMAIL_OAUTH_CLIENT_SECRET,
    GMAIL_OAUTH_REFRESH_TOKEN,
  },
  debug: { SEND_BCC, BCC_DEBUG_EMAIL },
} = GlobalVars;

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
    rejectUnauthorized: false,
  },
});

export const sendMail = async (options: SendMailOptions) => {
  if (DISABLE_SEND_EMAILS) {
    return Promise.resolve("Emails are disabled");
  }

  await transporter.sendMail({
    ...options,
    ...(SEND_BCC ? { bcc: BCC_DEBUG_EMAIL } : {}),
  });
};

export const testEmailService = async (email: string) => {
  try {
    await sendMail({
      to: email,
      subject: `TEST | #{new Date}`,
      text: `Test  ${new Date().toISOString()}`,
    });
    console.log(`Email sent to ${email} successfully.`);
  } catch (err) {
    console.error(`There was an error sengind an email to ${email}`);
  }
};
