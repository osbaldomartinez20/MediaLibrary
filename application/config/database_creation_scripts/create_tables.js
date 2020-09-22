const mysql = require('mysql');

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
  "CREATE TABLE posts (pid VARCHAR(36) PRIMARY KEY, title VARCHAR(255), author NVARCHAR(MAX), jtitle NVARCHAR(MAX), description VARCHAR(255), type VARCHAR(50), cover VARCHAR(255), image VARCHAR(255));" +
  "CREATE TABLE types (tid VARCHAR(36) PRIMARY KEY, name VARCHAR(255));" +
  "CREATE TABLE links (lid VARCHAR(36) PRIMARY KEY, link VARCHAR(255), pid VARCHAR(36) FOREIGN KEY REFERENCES posts(pid));" +
  "CREATE TABLE tags (tgid VARCHAR(36) PRIMARY KEY, tag VARCHAR(255), pid VARCHAR(36) FOREIGN KEY REFERENCES posts(pid));" +
  "CREATE TABLE issues (iid VARCHAR(36) PRIMARY KEY, issue VARCAHR(255), pid VARCHAR(36) FOREIGN KEY REFERENCES posts(pid))";
  connnection.query(sql, function (err, result) {
    if (err) throw err;
    console.log("Tables created");
  });
});