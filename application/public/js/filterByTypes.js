//Contributors: Osbaldo Martinez
//This file contains the functions that help filtering the results.
//The functions filter the results by only showing the posts with
//the given TSF type. If a new TSF type just add a new type to the typeList

//typeList start at 0, so 0 = "Other"
var typeList = ['Other', 'Transformation', 'Possession', 'Bodyswap'];

//paramater is an int with index of the type you want to filter for. Used in home.hbs
function showHide(typeIndex) {
    let docSelection = document.getElementsByClassName("resultRow");

    if (document.getElementById(typeList[typeIndex]).checked) {
        //this block hides the post that do not have the type.
        for (let i = 0; i < docSelection.length; i++) {
            let temp = docSelection[i].getElementsByTagName("TD")[5].childNodes[0].innerText;
            if (temp != typeList[typeIndex]) {
                //entries that do not have the type are given the hidden class, which hides said entry.
                docSelection[i].classList.add("hidden");
            }
        }
    } else {
        //this block removes the hidden class form the entries and makes them to be shown.
        for (let i = 0; i < docSelection.length; i++) {
            let temp = docSelection[i].getElementsByTagName("TD")[5].childNodes[0].innerText;
            if (temp != typeList[typeIndex]) {
                //entries have their hidden class removed to be able to be shown
                docSelection[i].classList.remove("hidden");
            }
        }
    }
}