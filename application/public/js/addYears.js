//Contributor: Osbaldo Martinez
//This file has the code to fill the year section of the form with the years from 1900-present.

let start = 1900;
let end = new Date().getFullYear();
let options = "<option value=\"Unknown\">Unknown</option>";

for (let year = start; year <= end; year++) {
    options += "<option value=\"" + year + "\">" + year + "</option>";
}

document.getElementById("year").innerHTML = options;
