require("dotenv").config();
const mysql = require("mysql2/promise");
const {
  DB_HOST,
  DB_USERNAME,
  DB_PASSWORD,
  DB_DATABASE,
  DB_MULTISTATEMENT,

  DB_HOST_TEST,
  DB_USERNAME_TEST,
  DB_PASSWORD_TEST,
  DB_DATABASE_TEST
} = process.env;
const env = process.env.NODE_ENV || "production";

const mysqlConfig = {
  production: {
    // for EC2 machine
    host: DB_HOST,
    user: DB_USERNAME,
    password: DB_PASSWORD,
    database: DB_DATABASE,
    waitForConnections: true,
    connectionLimit: 30,
    multipleStatements: DB_MULTISTATEMENT === "true" ? true : false
  },
  test: {
    // for automation testing (command: npm run test)
    host: DB_HOST_TEST,
    user: DB_USERNAME_TEST,
    password: DB_PASSWORD_TEST,
    database: DB_DATABASE_TEST,
    waitForConnections: true,
    connectionLimit: 30,
    multipleStatements: DB_MULTISTATEMENT === "true" ? true : false
  }
};

const pool = mysql.createPool(mysqlConfig[env]);

module.exports = {
  pool
};
