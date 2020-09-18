const mysql = require('mysql');

//fillout the information for your mysql server and database
const connnection = mysql.createConnection({
  host: "localhost",
  user: "",
  password: "",
  database: "",
  multipleStatements: true
});

//run this script for the tables of the database to be created
connnection.connect(function (err) {
  if (err) throw err;
  console.log("Connected!");
  var sql = "CREATE TABLE mods (id VARCHAR(36) PRIMARY KEY, username VARCHAR(255), password VARCHAR(255));" +
  "CREATE TABLE admin (aid VARCHAR(36) PRIMARY KEY, username VARCHAR(255), passsword VARCHAR(255))";
  connnection.query(sql, function (err, result) {
    if (err) throw err;
    console.log("Tables created");
  });
});