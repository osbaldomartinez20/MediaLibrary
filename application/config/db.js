const mysql = require('mysql2/promise');

//for my local server
const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "root",
  database: "tsfc",
  multipleStatements: true,
  waitForConnections: true,
  connectionLimit: 100,
  queueLimit: 1000
});

module.exports = pool;