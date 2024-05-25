const pool = require("../../config/db");
const keys = require("../../config/keys");
const { OpListQuery, patientListQuery } = require("../../utility/queryBuilder");

const getPatientByPhone_util = async (phone) => {
  const response = {
    status: false,
    statusCode: 404,
    message: "No data found",
  };
  try {
    const query = `SELECT * FROM patient WHERE phone = ?`;
    const values = [phone];
    const [rows] = await pool.execute(query, values, { prepare: true });
    if (Array.isArray(rows) && rows.length) {
      response.message = "Patient detailed fetched successfully.";
      response.status = true;
      response.statusCode = 200;
      [response.result] = rows;
    }
  } catch (err) {
    response.error = err?.message || "Internal Error";
  }
  return response;
};
const createPatient_util = async (req) => {
  const { first_name, last_name, age, phone, place, gender } = req;
  const response = {
    status: false,
    statusCode: 400,
    message: "Failed to register patient",
  };
  try {
    const query = `INSERT INTO patient (first_name, last_name, phone, age, place, gender) VALUES (?, ?, ?, ?, ?, ?)`;
    const values = [first_name, last_name, phone, age, place, gender];
    const [result] = await pool.execute(query, values, { prepare: true });
    if (result?.affectedRows) {
      response.message = "Patient detailed inserted successfully.";
      response.status = true;
      response.statusCode = 200;
      response.userId = result.insertId;
    }
  } catch (err) {
    response.error = err?.message || "Internal Error";
  }
  return response;
};
const patientList_util = async (reqObj) => {
  const response = {
    status: false,
    statusCode: 404,
    message: "No data found",
  };
  try {
    const { query, values } = patientListQuery(reqObj);
    const [rows] = await pool.execute(query, values, { prepare: true });
    if (Array.isArray(rows) && rows.length) {
      response.message = "Patient detailed fetched successfully.";
      response.status = true;
      response.statusCode = 200;
      response.result = rows;
    }
  } catch (err) {
    response.error = err?.message || "Internal Error";
  }
  return response;
};
const ceateOP_util = async (req) => {
  const { patient_id, docter_id, reason, prescription } = req;
  const response = {
    status: false,
    statusCode: 400,
    message: "Failed to create OP",
  };
  try {
    const query = `INSERT INTO medical_history (patient_id, docter_id, reason, prescription) VALUES (?, ?, AES_ENCRYPT(?, ?), AES_ENCRYPT(?, ?))`;
    const values = [
      patient_id,
      docter_id,
      reason,
      keys.aesSecretKey,
      prescription || "<p></p>",
      keys.aesSecretKey,
    ];
    const [result] = await pool.execute(query, values, { prepare: true });
    if (result?.affectedRows) {
      response.message = "Patient medical history inserted successfully.";
      response.status = true;
      response.statusCode = 200;
      response.dataId = result.insertId;
    }
  } catch (err) {
    response.error = err?.message || "Internal Error";
  }
  return response;
};
const OpList_util = async (req) => {
  const response = {
    status: false,
    statusCode: 404,
    message: "No data found",
  };
  try {
    const { query, values } = OpListQuery(req);
    const [rows] = await pool.execute(query, values, { prepare: true });
    if (Array.isArray(rows) && rows.length) {
      const formatData = rows.map((item) => ({
        ...item,
        reason: item?.reason?.toString("utf-8") || "",
        prescription: item?.prescription?.toString("utf-8") || "",
      }));
      response.message = "OP detailed fetched successfully.";
      response.status = true;
      response.statusCode = 200;
      response.result = formatData;
    }
  } catch (err) {
    response.error = err?.message || "Internal Error";
  }
  return response;
};
const patientMedicalHistory_cutil = async (req) => {
  const response = {
    status: false,
    statusCode: 404,
    message: "No data found",
  };
  try {
    const { query, values } = OpListQuery(req);
    const [rows] = await pool.execute(query, values, { prepare: true });
    if (Array.isArray(rows) && rows.length) {
      const formatData = rows.map((item) => ({
        ...item,
        reason: item?.reason?.toString("utf-8") || "",
        prescription: item?.prescription?.toString("utf-8") || "",
      }));
      response.message = "OP detailed fetched successfully.";
      response.status = true;
      response.statusCode = 200;
      response.result = formatData;
    }
  } catch (err) {
    response.error = err?.message || "Internal Error";
  }
  return response;
};
const updatePrescription_util = async (req) => {
  const { medical_record_id, prescription } = req;
  const response = {
    status: false,
    statusCode: 400,
    message: "Failed to update prescription",
  };
  try {
    const queryValue = `UPDATE medical_history SET prescription = AES_ENCRYPT(?, ?) WHERE id = ?`;
    const values = [prescription, keys.aesSecretKey, medical_record_id];
    const [result] = await pool.query(queryValue, values);
    if (result?.affectedRows) {
      response.status = true;
      response.statusCode = 200;
      response.message = "Prescription update success";
    }
  } catch (err) {
    response.error = err?.message || "Internal Error";
  }
  return response;
}
module.exports = {
  getPatientByPhone_util,
  createPatient_util,
  patientList_util,
  ceateOP_util,
  OpList_util,
  patientMedicalHistory_cutil,
  updatePrescription_util,
};
