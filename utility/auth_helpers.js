const pool = require("../config/db");
const jwt = require("jsonwebtoken")
const keys = require("../config/keys")
const apiKeyActiveStatusId = 1;

const validateApiKey = async (key) => {
  const response = {
    status: false,
    statusCode: 400,
    message: "Invalid API key",
  };
  try {
    const query = `SELECT * FROM api_token WHERE token = ? AND status = ${apiKeyActiveStatusId}`;
    const values = [key];
    const [rows] = await pool.execute(query, values, { prepare: true });
    if (Array.isArray(rows) && rows.length) {
      response.message = "API key validated successfully.";
      response.status = true;
      response.statusCode = 200;
    }
  } catch (err) {
    response.error = err?.message || "Internal Error";
  }
  return response;
};

const apiKeyValidator = async (req, res, next) => {
  if (req.headers && req.headers["api-key"]) {
    const validation = await validateApiKey(req.headers["api-key"]).catch(
      (err) => err
    );
    if (validation?.status) {
      return next();
    }
    return res.status(401).send({
      StatusCode: 401,
      Message: "Unauthorised",
      Description: "Invalid app authentication key",
    });
  }
  return res.status(401).send({
    StatusCode: 401,
    Message: "Unauthorised",
    Description: "Missing app authentication key",
  });
};

const authorizeToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];
  if (token) {
    jwt.verify(token, keys.jwtSecret, (err, decoded) => {
      if (err) {
        if (err.name === "TokenExpiredError") {
          return res.status(403).send({
            statusCode: 403,
            message: "KEY_EXPIRED",
            description: "Authorization key expired",
          });
        }
        return res.json({
          statusCode: 401,
          message: "UNAUTHORIZED",
          description: "Invalid Authorization key",
        });
      }
      req.userSession = decoded;
      return next();
    });
  } else {
    return res.json({
      statusCode: 401,
      message: "UNAUTHORIZED",
      description: "Please provide a valid authorization key",
    });
  }

};

const authorizeRefreshToken = (req, res, next) => {
  const refreshToken = req.cookies.jwt;
  if (!refreshToken) return res.status(401).send({ message: "Cookie doesn't exist" });
  jwt.verify(refreshToken, keys.jwtSecret, (err, decode) => {
    if (err) {
      if (err.name === "TokenExpiredError") {
        return res.status(403).send({
          statusCode: 403,
          message: "KEY_EXPIRED",
          description: "Authorization key expired",
        });
      }
      return res.json({
        statusCode: 401,
        message: "UNAUTHORIZED",
        description: "Invalid Authorization key",
      });
    }
    req.userSession = decode;
    return next();
  });
};

module.exports = {
  validateApiKey,
  apiKeyValidator,
  authorizeToken,
  authorizeRefreshToken,
};
