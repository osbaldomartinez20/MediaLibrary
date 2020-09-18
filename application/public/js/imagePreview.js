//Got help from stackoverflow
//https://stackoverflow.com/questions/14069421/show-an-image-preview-before-upload
$(document).ready(function () {

    document.getElementById("image").onchange = function () {
        var reader = new FileReader();
    
        reader.onload = function (e) {
            // get loaded data and render thumbnail.
            document.getElementById("img").src = e.target.result;
        };
    
        // read the image file as a data URL.
        reader.readAsDataURL(this.files[0]);
    };
});