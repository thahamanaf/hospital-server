const keys = require("../config/keys");

const accountActivationMailContent = async (token) => {
  return `<p>
  Account activation link:
  <a href=${`${keys.accountActivationMailLink}/${token}`}>Click here</a>
  </p>`;
};
const forgotPasswordMailContent = async (token) => {
  return `<p>
  Click the link to reset account password:
  <a href=${`${keys.resetPasswordMailLink}/${token}`}>Click here</a>
  </p>`;
};

module.exports = {
  accountActivationMailContent,
  forgotPasswordMailContent
};
