const pool = require("../../config/db");
const { v4: uuidv4 } = require("uuid");
const userRoles = require("../../config/userRoles");
const { userAccountStatusId } = require("../../utility/queryStatusIds");
const { staffListQuery } = require("../../utility/queryBuilder");

const getUserByEmail_util = async (email) => {
  const response = {
    status: false,
    statusCode: 404,
    message: "No data found",
  };
  try {
    const query = `SELECT * FROM user_account WHERE email = ?`;
    const values = [email];
    const [rows] = await pool.execute(query, values, { prepare: true });
    if (Array.isArray(rows) && rows.length) {
      response.message = "User detailed fetched successfully.";
      response.status = true;
      response.statusCode = 200;
      [response.result] = rows;
    }
  } catch (err) {
    response.error = err?.message || "Internal Error";
  }
  return response;
};
const registerUser_util = async (req) => {
  const { email, first_name, last_name, role_id } = req;
  const response = {
    status: false,
    statusCode: 400,
    message: "Failed to register user",
  };
  try {
    const query = `INSERT INTO user_account (id, first_name, last_name, email, role_id) VALUES (?, ?, ?, ?, ?)`;
    const uuid = uuidv4();
    const values = [uuid, first_name, last_name, email, role_id];
    const [result] = await pool.execute(query, values, { prepare: true });
    if (result?.affectedRows) {
      response.message = "User detailed inserted successfully.";
      response.status = true;
      response.statusCode = 200;
      response.userId = uuid;
    }
  } catch (err) {
    response.error = err?.message || "Internal Error";
  }
  return response;
};
const updateUserAccountActivationMailStatus_util = async (userId) => {
  const response = {
    status: false,
    statusCode: 400,
    message: "Failed to update mail status for user",
  };
  try {
    const queryValue = `UPDATE user_account SET is_activation_link_sended = ${userAccountStatusId.activationMailSended} WHERE id = '${userId}'`;
    const [result] = await pool.query(queryValue);
    if (result?.affectedRows) {
      response.status = true;
      response.statusCode = 200;
      response.message = "Sent mail status updated";
    }
  } catch (err) {
    response.error = err?.message || "Internal Error";
  }
  return response;
};
const activateAccount_util = async (req) => {
  const { email, password, userId } = req;
  const response = {
    status: false,
    statusCode: 400,
    message: "Failed to activate account",
  };
  try {
    const queryValue = `UPDATE user_account SET password = ?, is_active = ${userAccountStatusId.active} WHERE id = ? AND email = ?`;
    const values = [password, userId, email];
    const [result] = await pool.query(queryValue, values);
    if (result?.affectedRows) {
      response.status = true;
      response.statusCode = 200;
      response.message = "Account activated successfully";
    }
  } catch (err) {
    response.error = err?.message || "Internal Error";
  }
  return response;
};
const resetPassword_util = async (req) => {
  const { email, password, id } = req;
  const response = {
    status: false,
    statusCode: 400,
    message: "Failed to reset account password",
  };
  try {
    const queryValue = `UPDATE user_account SET password = ? WHERE id = ? AND email = ?`;
    const values = [password, id, email];
    const [result] = await pool.query(queryValue, values);
    if (result?.affectedRows) {
      response.status = true;
      response.statusCode = 200;
      response.message = "Password reset successfully";
    }
  } catch (err) {
    response.error = err?.message || "Internal Error";
  }
  return response;
};
const staffList_util = async (reqObj) => {
  const response = {
    status: false,
    statusCode: 404,
    message: "No data found",
  };
  try {
    const { query, values } = staffListQuery(reqObj);
    const [rows] = await pool.execute(query, values, { prepare: true });
    if (Array.isArray(rows) && rows.length) {
      response.message = "User detailed fetched successfully.";
      response.status = true;
      response.statusCode = 200;
      response.result = rows;
    }
  } catch (err) {
    response.error = err?.message || "Internal Error";
  }
  return response;
};
const getStatitics_util = async () => {
  const response = {
    status: false,
    statusCode: 404,
    message: "No data found",
  };
  try {
    const query = `SELECT
    (SELECT COUNT(*) FROM user_account WHERE role_id = ${userRoles.doctor}) AS total_doctor_count,
    (SELECT COUNT(*) FROM user_account WHERE role_id = ${userRoles.doctor} AND is_active = ${userAccountStatusId.active}) AS active_doctor_count,
    (SELECT COUNT(*) FROM patient) AS total_patient_count,
    (SELECT COUNT(DISTINCT(patient_id)) FROM medical_history WHERE DATE(date) = CURRENT_DATE) AS op_patient_count,
    (SELECT COUNT(*) FROM user_account WHERE role_id = ${userRoles.nurse}) AS total_nurse_count;
    `;
    const values = [];
    const [rows] = await pool.execute(query, values, { prepare: true });
    if (Array.isArray(rows) && rows.length) {
      response.message = "User detailed fetched successfully.";
      response.status = true;
      response.statusCode = 200;
      response.result = rows;
    }
  } catch (err) {
    response.error = err?.message || "Internal Error";
  }
  return response;
};
module.exports = {
  getUserByEmail_util,
  registerUser_util,
  updateUserAccountActivationMailStatus_util,
  activateAccount_util,
  resetPassword_util,
  staffList_util,
  getStatitics_util,
};
