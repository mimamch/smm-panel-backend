const nodemailer = require("nodemailer");

const sendEmail = async (destination, message) => {
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    requireTLS: true,
    auth: {
      user: process.env.EMAIL_MAILER,
      pass: process.env.PASSWORD_MAILER,
    },
  });
  const mailOptions = {
    from: {
      name: "Layanan Nusantara SMM",
      address: process.env.EMAIL_MAILER,
    },
    to: destination,
    subject: message.subject,
    html: message.html,
    text: message.text,
  };
  return await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
