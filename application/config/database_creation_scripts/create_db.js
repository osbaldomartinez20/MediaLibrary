const mysql = require('mysql');

//fillout the information of your mysql server
const connnection = mysql.createConnection({
  host: "localhost",
  user: "",
  password: "",
  multipleStatements: true
});

//this this script to create a new database
connnection.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
  connnection.query("CREATE DATABASE tsfc", function (err, result) {
    if (err) throw err;
    console.log("Database created");
  });
});