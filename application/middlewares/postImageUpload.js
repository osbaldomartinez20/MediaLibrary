//Contributors: Osbaldo Martinez
const multer = require('multer');
const path = require('path');
const mkdirp = require('mkdirp'); //this module has to be in version 0.5.1 or the code won't work.

// Multer storage settings
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        //folder where the images are uploaded
        const dir = "./public/images/upload/"; 
        mkdirp(dir, err => cb(err, dir));
    },
    filename: (req, file, cb) => {
        const fileName = Date.now() + '_' + (file.originalname).replace(/ /g, "_");;
        cb(null, fileName);
    }
});

// Multer settings
const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        var imageExt = path.extname(file.originalname);
        //only accepting jpg and png
        if (imageExt !== '.png' && imageExt !== '.jpg' && imageExt !== '.jpeg' && imageExt !== '.JPEG' && imageExt !== '.JPG') {
            return  cb(null, false);
        }
        cb(null, true);
    }
});

module.exports = upload;
