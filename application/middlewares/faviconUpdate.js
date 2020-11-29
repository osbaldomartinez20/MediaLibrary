//Contributors: Osbaldo Martinez
//Helps to update the favicon image
const multer = require('multer');
const path = require('path');
const mkdirp = require('mkdirp'); //this module has to be in version 0.5.1 or the code won't work.
const fs = require('fs');

// Multer storage settings
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        fs.unlinkSync('./public/images/main/favicon.ico');
        //folder where the images are uploaded
        const dir = "./public/images/main/"; 
        mkdirp(dir, err => cb(err, dir));
    },
    filename: (req, file, cb) => {
        const fileName = "favicon.ico";
        cb(null, fileName);
    }
});

// Multer settings
const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        var imageExt = path.extname(file.originalname);
        //only accepting ico
        if (imageExt !== '.ico') {
            return cb(null, false);
        }
        cb(null, true);
    }
});

module.exports = upload;