import sgMail from "@sendgrid/mail";
import "dotenv/config";

const { SENDGRID_API_KEY } = process.env;

sgMail.setApiKey(SENDGRID_API_KEY);

const sendEmail = async (data) => {
    const email = { ...data, from: "batalovakira@gmail.com" };
    await sgMail.send(email);
    return true;
};
export default sendEmail;
// const email = {
//     to: "batalovak@meta.ua",
//     from: "batalovakira@gmail.com",
//     subject: "test email",
//     html: "<h3>This is test email</h3>",
// };

// sgMail
//     .send(email)
//     .then(() => console.log("Email send success"))
//     .catch((error) => console.log(error.message));
