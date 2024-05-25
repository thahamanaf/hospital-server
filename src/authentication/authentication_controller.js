const sendMail_util = require("../../utility/send_mail");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
const bcrypt = require("bcrypt");
const {
  getUserByEmail_util,
  registerUser_util,
  updateUserAccountActivationMailStatus_util,
  activateAccount_util,
  resetPassword_util,
  staffList_util,
  getStatitics_util
} = require("./authentication_utils");

const {
  accountActivationMailContent,
  forgotPasswordMailContent,
} = require("../../utility/mail_contents");

const userAccountStatusId = {
  pending: 2,
  active: 1,
  inActive: 0,
};

const hashPassword = async (password) => {
  const saltRounds = 10;
  const salt = await bcrypt.genSalt(saltRounds);
  const encryptedPassword = await bcrypt.hash(password, salt);
  return encryptedPassword;
};

const verifyEncryptedPassword = async (password, encryptedPassword) => {
  const isMatch = await bcrypt.compare(password, encryptedPassword);
  return isMatch;
};

const generateJwtToken = (data, exp) => {
  const token = jwt.sign(
    {
      data,
    },
    keys.jwtSecret,
    { expiresIn: exp || keys.jwtAccessTokenExpiry }
  );
  return token;
};

const getUserByEmail_cntrl = async (email) => {
  const response = await getUserByEmail_util(email)
    .then((res) => res)
    .catch((err) => err);
  return response;
};

const registerUser_cntrl = async (req) => {
  const { email } = req;
  const response = {
    status: false,
    statusCode: 400,
    message: "Failed to register user.",
  };
  const isEmailExists = await getUserByEmail_util(email)
    .then((isEmailExistsRes) => isEmailExistsRes)
    .catch((err) => err);
  if (isEmailExists.status) {
    response.message = "Email already exists";
    return response;
  }
  const createUser = await registerUser_util(req)
    .then((registerRes) => registerRes)
    .catch((err) => err);
  if (createUser.status) {
    const authToken = generateJwtToken(
      { ...req, userId: createUser.userId },
      keys.accountActivationMailExpiry
    );
    const html = await accountActivationMailContent(authToken);
    const mailOptions = {
      to: email,
      subject: "Account activation link",
      html,
    };
    const sendMail = await sendMail_util(mailOptions);
    let updateMailStatus;
    if (sendMail.status) {
      updateMailStatus = await updateUserAccountActivationMailStatus_util(
        createUser.userId
      );
    }
    let message = "User account created successfully.";
    if (updateMailStatus.status) {
      message += " Account activation link has been sent to user email";
    }
    response.status = true;
    response.statusCode = 200;
    response.message = message;
  }
  return response;
};
const activateAccount_cntrl = async (req) => {
  const request = req;
  const encryptedPassword = await hashPassword(req.password);
  request.password = encryptedPassword;
  const response = await activateAccount_util(req)
    .then((res) => res)
    .catch((err) => err);
  return response;
};
const login_cntrl = async (req) => {
  const { email, password } = req;
  const response = {
    status: false,
    statusCode: 400,
    message: "Failed to login",
  };
  const getUser = await getUserByEmail_util(email)
    .then((getuserres) => getuserres)
    .catch((err) => err);
  if (!getUser.status) {
    response.message = "User not exists";
    return response;
  }
  const { result: user } = getUser;
  const verifyPassword = await verifyEncryptedPassword(password, user.password);
  if (!verifyPassword) {
    response.message = "Provide a valid password";
    return response;
  }
  delete user.password;
  response.accessToken = generateJwtToken(user);
  response.refreshToken = generateJwtToken(user, keys.jwtRefreshTokenExpiry);
  response.status = true;
  response.statusCode = 200;
  response.message = "User authenticated successfully";
  return response;
};
const forgotPassword_cntrl = async (req) => {
  const { email } = req;
  const response = {
    status: true,
    statusCode: 200,
    message: "Password reset instruction is sent to your mail",
  };
  const getUser = await getUserByEmail_util(email)
    .then((userRes) => userRes)
    .catch((err) => err);
  if (!getUser.status) {
    return response;
  }
  const { result: user } = getUser;
  if (Number(user.is_active) === userAccountStatusId.pending) {
    response.message = "Account activation is pending, Contact admin ";
    response.status = false;
    response.statusCode = 400;
    return response;
  }
  const authToken = generateJwtToken(
    user,
    keys.resetPasswordMailExpiry,
    keys.resetPasswordMailExpiry
  );
  const html = await forgotPasswordMailContent(authToken);
  const mailOptions = {
    to: email,
    subject: "Account password reset link",
    html,
  };
  const sendMail = await sendMail_util(mailOptions);
  if (sendMail.status) {
    response.mailStatus = true;
  }
  return response;
};

const resetPassword_cntrl = async (req) => {
  const {
    reqObj: { password },
  } = req;
  const request = req.user;
  const encryptedPassword = await hashPassword(password);
  request.password = encryptedPassword;
  const response = await resetPassword_util(request)
    .then((res) => res)
    .catch((err) => err);
  return response;
};
const validateUser_cntrl = async (user) => {
  const response = {
    status: false,
    statusCode: 400,
    message: "Failed to authenticate user",
  };
  const { email } = user;
  const getUser = await getUserByEmail_util(email)
    .then((res) => res)
    .catch((err) => err);
  if (!getUser.status) {
    response.message = "User not found";
    return response;
  }
  const { result } = getUser;
  if (Number(result.is_active) !== userAccountStatusId.active) {
    response.message = "Account inactive";
    return response;
  }
  response.message = "User is authenticated";
  response.status = true;
  response.statusCode = 200;
  response.accessToken = generateJwtToken(result);
  return response;
};
const staffList_cntrl = async (reqObj) => {
  const response = await staffList_util(reqObj)
    .then((res) => res)
    .catch((err) => err);
  return response;
};
const getStatitics_cntrl = async () => {
  const response = await getStatitics_util()
    .then((res) => res)
    .catch((err) => err);
  return response;
};
module.exports = {
  registerUser_cntrl,
  getUserByEmail_cntrl,
  activateAccount_cntrl,
  login_cntrl,
  forgotPassword_cntrl,
  resetPassword_cntrl,
  validateUser_cntrl,
  staffList_cntrl,
  getStatitics_cntrl,
};
