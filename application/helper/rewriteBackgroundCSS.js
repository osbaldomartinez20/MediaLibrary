const fs = require('fs');

exports.writeBackgroundColorCSS = (color, location, file) => {
    let cssToWrite = location + ' {\n\tbackground-color:' + color + ';\n}';
    fs.unlink('./public/stylesheets/' + file, (err) => {
        if(err) {
            fs.writeFileSync(__dirname + '/errors/' + Date.now() + 'error.log', err + '');
            return;
        }
        fs.writeFileSync('./public/stylesheets/' + file, cssToWrite);
    });
}