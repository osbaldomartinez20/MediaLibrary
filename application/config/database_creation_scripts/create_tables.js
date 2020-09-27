const mysql = require('mysql2');

//fillout the information for your mysql server and database
const connnection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "tsfc",
  multipleStatements: true
});

//run this script for the tables of the database to be created
connnection.connect(function (err) {
  if (err) throw err;
  console.log("Connected!");
  var sql = "CREATE TABLE mods (id VARCHAR(36) PRIMARY KEY, username VARCHAR(255), password VARCHAR(255), status INT);" +
  "CREATE TABLE admin (aid VARCHAR(36) PRIMARY KEY, username VARCHAR(255), passsword VARCHAR(255));" + 
  "CREATE TABLE posts (pid VARCHAR(36) PRIMARY KEY, title VARCHAR(255), author NVARCHAR(255), jtitle NVARCHAR(255), description VARCHAR(255), details NVARCHAR(500), type VARCHAR(50), cover VARCHAR(255), image VARCHAR(255), status INT, date DATETIME);" +
  "CREATE TABLE tsftypes (tid INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255));" +
  "CREATE TABLE links (lid VARCHAR(36) PRIMARY KEY, links VARCHAR(500), pid VARCHAR(36));" +
  "CREATE TABLE tags (tgid VARCHAR(36) PRIMARY KEY, tags VARCHAR(255), pid VARCHAR(36));" +
  "CREATE TABLE issues (iid VARCHAR(36) PRIMARY KEY, issues VARCHAR(255), pid VARCHAR(36))";
  connnection.query(sql, function (err, result) {
    if (err) throw err;
    console.log("Tables created");
  });
});