require("dotenv").config();
const nodemailer = require("nodemailer");
const { EMAIL_HOST, EMAIL_PORT, EMAIL_AUTH_USER, EMAIL_AUTH_PASSWORD } = process.env;

const mailUtil = nodemailer.createTransport({
  host: EMAIL_HOST,
  port: parseInt(EMAIL_PORT),
  secure: false,
  auth: {
    user: EMAIL_AUTH_USER,
    pass: EMAIL_AUTH_PASSWORD
  }
});

module.exports = mailUtil;
