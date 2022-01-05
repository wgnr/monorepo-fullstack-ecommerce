import { SendMailOptions } from "nodemailer";
import { sendMail } from "@utils/email/index";
import { IUserDocument } from "@models/entities/users/users.interface";

const newUserEmailBody = (user: IUserDocument) => {
  const { firstName } = user;

  return `
    <div>
      <h2>Welcome ${firstName}!</h2>
      <p>Your account has been created in monorepose Ecomerce :)</p>
      <br/>
      <span>Have a great day!</span>
    </div>
  `;
};

export const sendNewAccountCreated = async (user: IUserDocument) => {
  const { email, id, firstName } = user;
  if (!email) {
    console.error(`No email address was provided for the user id ${id}`);
    return;
  }

  const emailOptions: SendMailOptions = {
    to: email,
    subject: `Welcome ${firstName}!!`,
    html: newUserEmailBody(user),
  };

  try {
    await sendMail(emailOptions);
    console.log(`User ${id} was notified at ${email} successfully.`);
  } catch (err) {
    console.error(`User ${id} wasn't notified at ${email}!`);
  }
};
