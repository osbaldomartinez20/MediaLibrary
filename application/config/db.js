//Contributors: Osbaldo Martinez
//this file used the promise version of the mysql2 module
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "TSFCWebApp",
  database: "tsfc",
  multipleStatements: true,
  waitForConnections: true,
  connectionLimit: 1000,
  queueLimit: 1000000
});

module.exports = pool;
