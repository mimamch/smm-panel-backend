const nodemailer = require("nodemailer");

const sendEmail = async (destination, message) => {
  let transporter = nodemailer.createTransport({
    service: "gmail",
    secure: true,
    auth: {
      user: process.env.EMAIL_MAILER,
      pass: process.env.PASSWORD_MAILER,
    },
  });
  const mailOptions = {
    from: "Layanan NUSANTARA SMM",
    to: destination,
    subject: message.subject,
    html: message.html,
    text: message.text,
  };
  return await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
