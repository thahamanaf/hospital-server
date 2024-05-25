module.exports = {
  dbName: process.env.DBNAME,
  dbPassword: process.env.DBPASSWORD,
  dbUser: process.env.DBUSER,
  dbHost: process.env.DBHOST,
  mailTrapHost: process.env.MAILTRAPHOST,
  mailTrapPort: process.env.MAILTRAPPORT,
  mailTrapUser: process.env.MAILTRAPUSER,
  mailTrapPassword: process.env.MAILTRAPPASSWORD,
  mailTrapEmailFrom: process.env.MAILTRAPEMAILFROM,
  jwtSecret: process.env.JWT_SECRET,
  jwtAccessTokenExpiry: process.env.JWTACCESSTOKENEXPIRY,
  jwtRefreshTokenExpiry: process.env.JWTREFRESHTOKENEXPIRY,
  accountActivationMailExpiry: process.env.ACCOUNTACTIVATIONMAILEXPIRY,
  accountActivationMailLink: process.env.ACCOUNTACTIVATIONMAILLINK,
  resetPasswordMailLink: process.env.RESETPASSWORDMAILLINK,
  resetPasswordMailExpiry: process.env.RESETPASSWORDMAILEXPIRY,
  allowedHosts: process.env.ALLOWEDHOST,
  aesSecretKey: process.env.AES_SECRET_KEY,


};
