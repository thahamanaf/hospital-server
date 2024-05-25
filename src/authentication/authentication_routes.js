const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");

const {
  registerUser_cntrl,
  activateAccount_cntrl,
  login_cntrl,
  forgotPassword_cntrl,
  resetPassword_cntrl,
  validateUser_cntrl,
  staffList_cntrl,
  getStatitics_cntrl,
} = require("./authentication_controller");
const {
  authorizeToken,
  authorizeRefreshToken,
} = require("../../utility/auth_helpers");
const { passwordRegex } = require("../../utility/regexPatterns");

const oneDayCookieExpiry = 24 * 60 * 60 * 1000;

router.get("/test", (req, res) => {
  res.send("auth route test okay");
});

router.post(
  "/register",
  [
    check("email")
      .trim()
      .isEmail()
      .withMessage("Provide a valid email adress")
      .notEmpty()
      .toLowerCase(),
    check("first_name")
      .trim()
      .isString()
      .withMessage("Provide a valid full name")
      .notEmpty(),
    check("last_name")
      .trim()
      .isString()
      .withMessage("Provide a valid last name")
      .notEmpty(),
    check("role_id")
      .isNumeric()
      .withMessage("Provide a valid role details")
      .notEmpty(),
  ],
  authorizeToken,
  async (req, res) => {
    const validationRes = validationResult(req);
    if (!validationRes.isEmpty()) {
      return res.status(400).send({
        status: false,
        statusCode: 400,
        message: "Field validation errors",
        validationRes,
      });
    }
    const { body } = req;
    const response = await registerUser_cntrl(body)
      .then((res) => res)
      .catch((err) => err);
    try {
      return res.status(response.statusCode).send(response);
    } catch (error) {
      return res.status(400).send({
        status: false,
        statusCode: 400,
        message: "Failed to register user",
        error: response?.message || error?.message || "Internal Error",
      });
    }
  }
);
router.patch(
  "/activate-account",
  [
    check("password")
      .trim()
      .matches(passwordRegex)
      .withMessage(
        "Password should be atleast of 8 characters, 1 Numeric, 1 Uppercase, 1 Lowercase and 1 special characters"
      )
      .notEmpty(),
  ],
  authorizeToken,
  async (req, res) => {
    const validationRes = validationResult(req);
    if (!validationRes.isEmpty()) {
      return res.status(400).send({
        status: false,
        statusCode: 400,
        message: "Field validation errors",
        validationRes,
      });
    }
    const user = req.userSession.data;
    const reqObj = req.body;
    const response = await activateAccount_cntrl({ ...reqObj, ...user })
      .then((res) => res)
      .catch((err) => err);
    try {
      return res.status(response.statusCode).send(response);
    } catch (error) {
      return res.status(400).send({
        status: false,
        statusCode: 400,
        message: "Failed to activate account.",
        error: response?.message || error?.message || "Internal Error",
      });
    }
  }
);
router.post(
  "/login",
  [
    check("email")
      .trim()
      .isEmail()
      .withMessage("Provide a valid email")
      .notEmpty()
      .toLowerCase(),
    check("password").trim().notEmpty().withMessage("Provide a valid password"),
  ],
  async (req, res) => {
    const validationRes = validationResult(req);
    if (!validationRes.isEmpty()) {
      return res.status(400).send({
        status: false,
        statusCode: 400,
        message: "Field validation errors",
        validationRes,
      });
    }
    const { body } = req;
    const response = await login_cntrl(body)
      .then((res) => res)
      .catch((err) => err);
    try {
      res.cookie("jwt", response.refreshToken, {
        httpOnly: true,
        samesite: "none",
        maxAge: oneDayCookieExpiry,
      });
      delete response.refreshToken;
      return res.status(response.statusCode).send(response);
    } catch (error) {
      return res.status(400).send({
        status: false,
        statusCode: 400,
        message: "Failed to login",
        error: response?.message || error?.message || "Internal Error",
      });
    }
  }
);
router.post(
  "/forgot-password",
  [
    check("email")
      .trim()
      .isEmail()
      .withMessage("Provide a valid email")
      .notEmpty()
      .withMessage("Email is required")
      .toLowerCase(),
  ],
  async (req, res) => {
    const validationRes = validationResult(req);
    if (!validationRes.isEmpty()) {
      return res.status(400).send({
        status: false,
        statusCode: 400,
        message: "Field validation errors",
        validationRes,
      });
    }
    const { body } = req;
    const response = await forgotPassword_cntrl(body)
      .then((res) => res)
      .catch((err) => err);
    try {
      return res.status(response.statusCode).send(response);
    } catch (error) {
      return res.status(400).send({
        status: false,
        statusCode: 400,
        message: "Failed to send password reset mail.",
        error: response?.message || error?.message || "Internal Error",
      });
    }
  }
);
router.patch(
  "/reset-password",
  [
    check("password")
      .trim()
      .matches(passwordRegex)
      .withMessage(
        "Password should be atleast of 8 characters, 1 Numeric, 1 Uppercase, 1 Lowercase and 1 special characters"
      )
      .notEmpty(),
  ],
  authorizeToken,
  async (req, res) => {
    const validationRes = validationResult(req);
    if (!validationRes.isEmpty()) {
      return res.status(400).send({
        status: false,
        statusCode: 400,
        message: "Field validation errors",
        validationRes,
      });
    }
    const reqObj = req.body;
    const user = req.userSession.data;
    const response = await resetPassword_cntrl({ reqObj, user })
      .then((res) => res)
      .catch((err) => err);
    try {
      return res.status(response.statusCode).send(response);
    } catch (error) {
      return res.status(400).send({
        status: false,
        statusCode: 400,
        message: "Failed to reset account password.",
        error: response?.message || error?.message || "Internal Error",
      });
    }
  }
);
router.post("/logout", async (req, res) => {
  res.clearCookie("jwt");
  res.status(201).send({ status: true, message: "User logout successfully" });
});
router.get("/new-token", authorizeRefreshToken, async (req, res) => {
  const user = req.userSession.data;
  const response = await validateUser_cntrl(user)
    .then((res) => res)
    .catch((err) => err);
  try {
    return res.status(response.statusCode).send(response);
  } catch (error) {
    return res.status(400).send({
      status: false,
      statusCode: 400,
      message: "Failed to authenticate user.",
      error: response?.message || error?.message || "Internal Error",
    });
  }
});
router.get("/staff-list", authorizeToken, async (req, res) => {
  const reqObj = req.query;
  const response = await staffList_cntrl(reqObj)
    .then((res) => res)
    .catch((err) => err);
  try {
    return res.status(response.statusCode).send(response);
  } catch (error) {
    return res.status(400).send({
      status: false,
      statusCode: 400,
      message: "Failed to fetch staff list.",
      error: response?.message || error?.message || "Internal Error",
    });
  }
});
router.get("/statitics", authorizeToken, async (req, res) => {
  const response = await getStatitics_cntrl()
    .then((res) => res)
    .catch((err) => err);
  try {
    return res.status(response.statusCode).send(response);
  } catch (error) {
    return res.status(400).send({
      status: false,
      statusCode: 400,
      message: "Failed to get data",
      error: response?.message || error?.message || "Internal Error",
    });
  }
});
module.exports = router;
