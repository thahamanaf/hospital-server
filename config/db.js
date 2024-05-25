const mysql = require("mysql2/promise")
const keys = require("./keys")

const pool = mysql.createPool({
  host: keys.dbHost,
  user: keys.dbUser,
  password: keys.dbPassword,
  database: keys.dbName
})

module.exports = pool;