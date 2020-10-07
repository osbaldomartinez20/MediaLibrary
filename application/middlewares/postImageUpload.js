const multer = require('multer');
const path = require('path');
const mkdirp = require('mkdirp'); //this module has to be in version 0.5.1 or the code won't work.

// Multer storage settings
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
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
        if (imageExt !== '.png' && imageExt !== '.jpg' && imageExt !== '.jpeg' && imageExt !== '.JPEG' && imageExt !== '.JPG' && imageExt !== '.svg') {
            return cb(new Error('Only images are allowed'));
        }
        cb(null, true);
    }
});

module.exports = upload;