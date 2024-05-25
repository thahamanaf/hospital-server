const keys = require("../../config/keys");

const {
  getPatientByPhone_util,
  createPatient_util,
  patientList_util,
  ceateOP_util,
  OpList_util,
  patientMedicalHistory_cutil,
  updatePrescription_util,
} = require("./patient_utils");

const createPatient_cntrl = async (req) => {
  const response = {
    status: false,
    statusCode: 400,
    message: "Patient creation failed",
  };

  const isSamePhoneExists = await getPatientByPhone_util(req.phone)
    .then((res) => res)
    .catch((err) => err);
  if (isSamePhoneExists.status) {
    response.message = "Phone number already exists";
    return response;
  }
  const createPatient = await createPatient_util(req)
    .then((res) => res)
    .catch((err) => err);
  if (createPatient.status) {
    return createPatient;
  }

  return response;
};
const patientList_cntrl = async (reqObj) => {
  const response = await patientList_util(reqObj)
    .then((res) => res)
    .catch((err) => err);
  return response;
};

const createOP_cntrl = async (req) => {
  const response = await ceateOP_util(req)
    .then((res) => res)
    .catch((err) => err);
  return response;
};
const OpList_cntrl = async (req) => {
  const response = await OpList_util(req)
    .then((res) => res)
    .catch((err) => err);
  return response;
};
const patientMedicalHistory_cntrl = async (req) => {
  const response = await patientMedicalHistory_cutil(req)
    .then((res) => res)
    .catch((err) => err);
  return response;
};
const updatePrescription_cntrl = async (req) => {
  const response = await updatePrescription_util(req)
    .then((res) => res)
    .catch((err) => err);
  return response;
}
module.exports = {
  createPatient_cntrl,
  patientList_cntrl,
  createOP_cntrl,
  OpList_cntrl,
  patientMedicalHistory_cntrl,
  updatePrescription_cntrl,
};
