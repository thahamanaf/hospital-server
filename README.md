
# Hospital Management API

This app is developed using Nodejs with Express. We are focusing on the API side for the project



## Environment Variables

To run this project, you will need to add the following environment variables to your .env file replace the example value with your keys.

`PORT=5000` 

`ALLOWEDHOST="http://localhost:3000"`

`DBHOST="localhost"`

`DBUSER="thaha"`

`DBPASSWORD="Thaha@123"`

`DBNAME="hospital_management"`

`JWT_SECRET = "AbCdEfGhIjKlMnOpQrStUvWxYz123456"`

`MAILTRAPHOST="<mailtrap host>"`

`MAILTRAPPORT="<mailtrap port>"`

`MAILTRAPUSER="<mailtrap user>"`

`MAILTRAPPASSWORD="<mailtrap password>"`

`MAILTRAPEMAILFROM="test@example.com"`

`JWTACCESSTOKENEXPIRY=900000`

`JWTREFRESHTOKENEXPIRY="24h"`

`ACCOUNTACTIVATIONMAILEXPIRY="7d"`

`ACCOUNTACTIVATIONMAILLINK="http://localhost:3000/activate-account"`

`RESETPASSWORDMAILLINK="http://localhost:3000/reset-password"`

`RESETPASSWORDMAILEXPIRY="3h"`

`DOCTOR_ROLE_ID=2`

`ADMIN_ROLE_ID=1`

`NURSE_ROLE_ID=3`

`AES_SECRET_KEY="jYEQOWLhgg22M0W"`




## Run Locally

Clone the project

```bash
  git clone https://github.com/thahamanaf/hospital-server
```

Go to the project directory

```bash
  cd hospital_server
```

Make sure node v18 or higher is installed

Install dependencies

```bash
  npm run i
```

Start the app

```bash
  npm start
```



## Documentation

In this project we have a total of 15 API's
6 for patients and 9 for authentication and user related

## Used By

This project is used by the following developers:

- Thaha Hussain


