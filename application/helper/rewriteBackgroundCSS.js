//Contributor: Osbaldo Martinez
const fs = require('fs');

//Deletes curent file with the CSS and writes a new CSS file with the color.
//Paramatera are color(in a format that can be used by css), location(where the css is making the change), and file(the css file to rewrite).
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