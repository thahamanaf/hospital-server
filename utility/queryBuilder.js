const keys = require("../config/keys");
const userRoles = require("../config/userRoles");

const OpListQuery = (req) => {
  const values = [];
  let query = `SELECT patient.gender, patient.age, patient.place, patient.phone, CONCAT(patient.first_name, " ", patient.last_name) AS patient_name, CONCAT(docter_user_account.first_name, " ", docter_user_account.last_name) AS doctor_name, medical_history.id, patient_id, docter_id, date, AES_DECRYPT(reason, '${keys.aesSecretKey}') as reason, AES_DECRYPT(prescription, '${keys.aesSecretKey}') as prescription FROM medical_history
  INNER JOIN user_account as docter_user_account ON medical_history.docter_id = docter_user_account.id
  INNER JOIN patient ON medical_history.patient_id = patient.id`;
  let queryFlag = true;
  if (Object.prototype.hasOwnProperty.call(req, "date")) {
    query += ` ${queryFlag ? "WHERE" : "AND"} DATE(date) = ?`;
    values.push(req.date);
    queryFlag = false;
  }
  if (Object.prototype.hasOwnProperty.call(req, "patient_id")) {
    query += ` ${queryFlag ? "WHERE" : "AND"} patient.id = ?`;
    values.push(req.patient_id);
    queryFlag = false;
  }
  return { query, values };
};

const staffListQuery = (req) => {
  const values = [];
  let query = `SELECT user_role.role_name, user_account.role_id, user_account.id, user_account.first_name, user_account.last_name, user_account.email, user_account.is_active, user_account.is_activation_link_sended FROM user_account INNER JOIN user_role ON user_account.role_id = user_role.id WHERE role_id != ${userRoles.admin}`;

  if (Object.prototype.hasOwnProperty.call(req, "role_id")) {
    query += " AND role_id = ?";
    values.push(req.role_id);
  }
  if (Object.prototype.hasOwnProperty.call(req, "is_active")) {
    query += " AND is_active = ?";
    values.push(req.is_active);
  }

  return { query, values };
};
const patientListQuery = (req) => {
  const values = [];
  let query = "SELECT * FROM patient";
  let queryFlag = true;

  if (Object.prototype.hasOwnProperty.call(req, "phone")) {
    query += ` ${queryFlag ? "WHERE" : "AND"} phone = ?`;
    values.push(req.phone);
    queryFlag = false;
  }
  if (Object.prototype.hasOwnProperty.call(req, "filter")) {
    query += ` ${queryFlag ? "WHERE" : "AND"} first_name LIKE ? OR last_name LIKE ?`;
    values.push(`%${req.filter}%`, `%${req.filter}%`);
    queryFlag = false;
  }

  return { query, values}
};
module.exports = {
  OpListQuery,
  staffListQuery,
  patientListQuery
};

