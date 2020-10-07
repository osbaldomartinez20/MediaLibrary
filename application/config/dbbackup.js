const mysqldump = require('mysqldump');
const fs = require('fs');

exports.createNewDBBackup = async function() {
    let date = new Date();
    let dd = date.getDate();
    let mm = date.getMonth() + 1; //counts months begining at 0, so we need a +1 offset
    let yyyy = date.getFullYear();
    let hh = date.getHours();
    let mi = date.getMinutes();


    let backupDate = yyyy + '-' + mm + '-' + dd + '_' + hh + '-' + mi;

    const result = await mysqldump({
        connection: {
            host: 'localhost',
            user: 'root',
            password: 'root',
            database: 'tsfc',
        },
        tables: ['issues', 'links', 'origin', 'posts', 'tags', 'tsftypes'],
        //dumpToFile: './public/database_backup/' + backupDate + '_dump.sql',
    });
    let schema = '';
    for (let i = 0; i < result.tables.length; i++) {
        if(result.tables[i].name != 'admin' && result.tables[i].name != 'mods') {
            schema += result.tables[i].schema;
        }
    }
    for (let i = 0; i < result.tables.length; i++) {
        if(result.tables[i].name != 'admin' && result.tables[i].name != 'mods') {
            schema += result.tables[i].data;
        }
    }
    fs.writeFileSync('./public/database_backup/' + backupDate + '_dump.sql', schema);
}