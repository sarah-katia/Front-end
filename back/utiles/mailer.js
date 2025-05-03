// utils/mailer.js
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'lmcslabo@gmail.com',
    pass: process.env.EMAIL_PASSWORD,
  },
});


const sendEmail = async (mailOptions) => {
  return transporter.sendMail(mailOptions);
};

module.exports = sendEmail;

module.exports = transporter;