//Contributors: Osbaldo Martinez
//Got help from stackoverflow
//https://stackoverflow.com/questions/14069421/show-an-image-preview-before-upload

//this jquery function helps with showing the image preview for uploaded images.
//make sure that the field to upload the cover image has the id: coverImage
//and the work image upload field has the id: mangaImage
//This is used in editPostImage.hbs and imagePost.hbs
$(document).ready( () => {

    document.getElementById("mangaImage").onchange = function () {
        var reader = new FileReader();
    
        reader.onload = function (e) {
            // get loaded data and render thumbnail.
            document.getElementById("img2").src = e.target.result;
        };
    
        // read the image file as a data URL.
        reader.readAsDataURL(this.files[0]);
    };

    document.getElementById("coverImageP").onchange = function () {
        var reader = new FileReader();
    
        reader.onload = function (e) {
            // get loaded data and render thumbnail.
            document.getElementById("img").src = e.target.result;
        };
    
        // read the image file as a data URL.
        reader.readAsDataURL(this.files[0]);
    };

    document.getElementById("resetForm").onclick = function () {
        document.getElementById("img2").src = null;
        document.getElementById("img").src = null;
    }
});