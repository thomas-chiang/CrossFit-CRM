require('dotenv').config()
const mysql = require('mysql2/promise')
const {DB_HOST, DB_USERNAME, DB_PASSWORD, DB_DATABASE, DB_MULTISTATEMENT} = process.env;

const mysqlConfig = {
  host: DB_HOST,
  user: DB_USERNAME,
  password: DB_PASSWORD,
  database: DB_DATABASE,
  // 無可用連線時是否等待pool連線釋放(預設為true) -- https://gist.github.com/kejyun/7940613
  waitForConnections: true,
  connectionLimit: 30,
  multipleStatements: DB_MULTISTATEMENT==='true' ? true : false
};

const pool = mysql.createPool(mysqlConfig);

module.exports = {
    pool
};