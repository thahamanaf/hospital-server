const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
dotenv.config();
const corsOptions = require("./config/corsOptions");
const authenticationRoutes = require("./src/authentication/authentication_routes");
const patientRoutes = require("./src/patient/patient_routes")
const { apiKeyValidator } = require("./utility/auth_helpers");

const app = express();
const port = process.env.PORT;
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

app.use(apiKeyValidator);
app.use("/api/auth", authenticationRoutes);
app.use("/api/patient", patientRoutes);

app.listen(port, () => {
  console.log(`App is listening on port ${port}`);
});
