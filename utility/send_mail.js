const keys = require("../config/keys");
const nodemailer = require("nodemailer");

//  example of mail options
//  {
//   to: user@example.com,
//   subject: "Account setup link sent",
//   html: emailTemplate,
//  responseMsg: "Mail send succesfult"
// };
const sendMail_util = async (options) => {
  const response = {
    status: false,
    statusCode: 400,
    message: "Failed to send mail",
  };
  const transport = nodemailer.createTransport({
    host: keys.mailTrapHost,
    port: keys.mailTrapPort,
    auth: {
      user: keys.mailTrapUser,
      pass: keys.mailTrapPassword,
    },
  });
  const mailOptions = {
    from: keys.mailTrapEmailFrom,
    ...options,
  };
  try {
    const sendmail = await transport.sendMail(mailOptions);
    response.mailResponse = sendmail.response;
    response.status = true;
    response.message = options?.responseMsg || "Mail sent successfully.";
    response.statusCode = 200;
  } catch (error) {
    response.error = error?.message;
  }

  return response;
};

module.exports = sendMail_util;
