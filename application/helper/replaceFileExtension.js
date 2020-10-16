//Contributors: Osbaldo Martinez
//This file has a method to replace the extension from image names.

//returns a string ending with .jpeg by using a filename of an image
exports.replaceExtensionWithjpeg = (filename) => {
    let temp = "";
    for(let i = 0; i < filename.length; i++) {
        if(filename.charAt(i) == '.') {
            temp = filename.substring(0, i);
        }
    }
    temp += ".jpeg";
    return temp;
}