//Contributors: Osbaldo Martinez
//This file adds the starting values for the tsftypes table.
const db = require('../db2');

let sql = "INSERT INTO tsftypes (name) VALUES (?);INSERT INTO tsftypes (name) VALUES (?);INSERT INTO tsftypes (name) VALUES (?);INSERT INTO tsftypes (name) VALUES (?)";

let names = ["Bodyswap(入れ替わり)", "Possession(憑依)", "Transformation(他者変身)", "Other"];

db.query(sql, names, (err, result) => {
    if (err) throw err;
    console.log(result);
});