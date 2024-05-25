const express = require("express");
const { authorizeToken } = require("../../utility/auth_helpers");
const router = express.Router();
const { check, validationResult } = require("express-validator");

const {
  createPatient_cntrl,
  patientList_cntrl,
  createOP_cntrl,
  OpList_cntrl,
  patientMedicalHistory_cntrl,
  updatePrescription_cntrl,
} = require("./patient_controller");

router.post(
  "/create-patient",
  [
    check("first_name")
      .trim()
      .isAlpha()
      .withMessage("Provide a valid first name")
      .notEmpty()
      .withMessage("First name is required"),
    check("last_name")
      .trim()
      .isAlpha()
      .withMessage("Provide a valid last name")
      .notEmpty()
      .withMessage("Last name is required"),
    check("gender")
      .trim()
      .isAlpha()
      .withMessage("Provide a valid gender")
      .notEmpty()
      .withMessage("Gender is required"),
    check("place")
      .trim()
      .isAlpha()
      .withMessage("Provide a valid place")
      .notEmpty()
      .withMessage("Place is required"),
    check("age")
      .isNumeric()
      .withMessage("Provide a valid age")
      .notEmpty()
      .withMessage("Age is required"),
    check("phone")
      .trim()
      .isString()
      .withMessage("Provide a valid number")
      .notEmpty()
      .withMessage("Number is required"),
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
    const response = await createPatient_cntrl(reqObj)
      .then((res) => res)
      .catch((err) => err);
    try {
      return res.status(response.statusCode).send(response);
    } catch (error) {
      return res.status(400).send({
        status: false,
        statusCode: 400,
        message: "Failed to register patient",
        error: response?.message || error?.message || "Internal Error",
      });
    }
  }
);

router.get("/patient-list", authorizeToken, async (req, res) => {
  const reqObj = req.query;
  const response = await patientList_cntrl(reqObj)
    .then((res) => res)
    .catch((err) => err);
  try {
    return res.status(response.statusCode).send(response);
  } catch (error) {
    return res.status(400).send({
      status: false,
      statusCode: 400,
      message: "Failed to fetch patient list.",
      error: response?.message || error?.message || "Internal Error",
    });
  }
});

router.post(
  "/new-op",
  [
    check("patient_id")
      .isNumeric()
      .withMessage("Provide a valid patiend id")
      .notEmpty()
      .withMessage("Patient id is required"),
    check("reason")
      .isString()
      .trim()
      .withMessage("Provide a valid reason")
      .notEmpty()
      .withMessage("Reason is required"),
    check("docter_id")
      .isString()
      .withMessage("Provide a valid docter id")
      .notEmpty()
      .withMessage("Docter id is required"),
    check("prescription")
      .isString()
      .withMessage("Provide valid prescription")
      .optional(),
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
    const response = await createOP_cntrl(req.body)
      .then((res) => res)
      .catch((err) => err);
    try {
      return res.status(response.statusCode).send(response);
    } catch (error) {
      return res.status(400).send({
        status: false,
        statusCode: 400,
        message: "Failed to create OP",
        error: response?.message || error?.message || "Internal Error",
      });
    }
  }
);
router.get("/op-list", authorizeToken, async (req, res) => {
  const reqObj = req.query;
  const response = await OpList_cntrl(reqObj)
    .then((res) => res)
    .catch((err) => err);

  try {
    return res.status(response.statusCode).send(response);
  } catch (error) {
    return res.status(400).send({
      status: false,
      statusCode: 400,
      message: "Failed to fetch op list.",
      error: response?.message || error?.message || "Internal Error",
    });
  }
});
router.get(
  "/medical-history/:patient_id",
  [
    check("patient_id")
      .isNumeric()
      .withMessage("Provide a valid patient id")
      .notEmpty()
      .withMessage("Patient id is required"),
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
    const reqObj = req.params;
    const response = await patientMedicalHistory_cntrl(reqObj)
      .then((res) => res)
      .catch((err) => err);
    try {
      return res.status(response.statusCode).send(response);
    } catch (error) {
      return res.status(400).send({
        status: false,
        statusCode: 400,
        message: "Failed to fetch  details.",
        error: response?.message || error?.message || "Internal Error",
      });
    }
  }
);
router.patch(
  "/update-prescription/:medical_record_id",
  [
    check("medical_record_id")
      .isNumeric()
      .withMessage("Provide a valid medical record id")
      .notEmpty()
      .withMessage("Medical record id is required"),
    check("prescription").notEmpty().withMessage("Prescription is needed"),
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
    const reqObj = { ...req.params, ...req.body };
    const response = await updatePrescription_cntrl(reqObj)
      .then((res) => res)
      .catch((err) => err);
    try {
      return res.status(response.statusCode).send(response);
    } catch (error) {
      return res.status(400).send({
        status: false,
        statusCode: 400,
        message: "Failed to update prescription.",
        error: response?.message || error?.message || "Internal Error",
      });
    }
  }
);
module.exports = router;
