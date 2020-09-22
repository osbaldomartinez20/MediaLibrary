const mysql = require('mysql');

//for my local server
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "tsfc",
  multipleStatements: true
});

module.exports = connection;