//file conatining the code to copy an image N number of times.
const fs = require('fs');

const PATH_TO_IMAGE_TO_COPY = "../public/images/main/eye.png";
const NUMBER_OF_TIMES_TO_COPY_IMAGE = 150;

const makeCopiesOfImage = (img, numberOfCopies) => {
    fs.readFile(img, (err, data) => {
        if(err) {
            console.log(err);
        }
        for (let i = 0; i < numberOfCopies; i++) {
            fs.writeFileSync('../public/images/upload/test_' + i + '.png', data)
        }
    });
}


makeCopiesOfImage(PATH_TO_IMAGE_TO_COPY, NUMBER_OF_TIMES_TO_COPY_IMAGE);