//Contributors: Osbaldo Martinez

const mysqldump = require('mysqldump');
const fs = require('fs');

exports.createNewDBBackup = async function() {
    //get date for the file
    let date = new Date();
    let dd = date.getDate();
    let mm = date.getMonth() + 1; //counts months begining at 0, so we need a +1 offset
    let yyyy = date.getFullYear();
    let hh = date.getHours();
    let mi = date.getMinutes();


    let backupDate = yyyy + '-' + mm + '-' + dd + '_' + hh + '-' + mi;

    //get the dump of the whole database
    const result = await mysqldump({
        connection: {
            host: 'localhost',
            user: 'root',
            password: 'TSFCWebApp',
            database: 'tsfc',
        },
        tables: ['issues', 'links', 'origin', 'posts', 'tags', 'tsftypes'],
        //dumpToFile: './public/database_backup/' + backupDate + '_dump.sql',
    });

    let schema = '';
    //get the schema for the tables skipping the admin and mods table
    for (let i = 0; i < result.tables.length; i++) {
        if(result.tables[i].name != 'admin' && result.tables[i].name != 'mods') {
            schema += result.tables[i].schema;
        }
    }
    //get the data for the tables skipping the admin and mods table
    for (let i = 0; i < result.tables.length; i++) {
        if(result.tables[i].name != 'admin' && result.tables[i].name != 'mods') {
            schema += result.tables[i].data;
        }
    }
    //write the dump into an sql file
    fs.writeFileSync(__dirname + '/database_backup/' + backupDate + '_dump.sql', schema);
}
