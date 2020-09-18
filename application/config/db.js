const mysql = require('mysql');

//for my local server
const connection = mysql.createConnection({
  host: "localhost",
  user: "",
  password: "",
  database: "",
  multipleStatements: true
});

module.exports = connection;