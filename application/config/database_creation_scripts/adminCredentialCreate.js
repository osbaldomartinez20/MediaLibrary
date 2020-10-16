//Contributors: Osbaldo Martinez
//This file adds the admin to the admin table
const db = require('../db');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');

let adminCreate = function() {
    let uid = uuidv4();
    let adminName = "ADMIN NAME HERE";
    let adminPass = "ADMIN PASSWORD HERE";
    let sql = "INSERT INTO admin (aid, username, password) VALUES (?, ?, ?)";

    bcrypt.genSalt(10, (err, salt) => {
        if (err) throw err;

        bcrypt.hash(adminPass, salt, (err, hash) => {
            if (err) throw err;

            let password = hash;

            // Insert admin info into database
            db.query(sql, [uid, adminName, password], (error, result) => {
                if (err) throw err;

                console.log("Admin credentials created");
            });
        });
    });
}

adminCreate();