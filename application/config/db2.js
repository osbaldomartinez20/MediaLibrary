//Contributors: Osbaldo Martinez
//this file uses the non-promise version of the mysql2 module

const mysql = require('mysql2');

const pool = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "root",
    database: "tsfc",
    multipleStatements: true,
    waitForConnections: true,
    connectionLimit: 1000,
    queueLimit: 1000000
  });

module.exports = pool;