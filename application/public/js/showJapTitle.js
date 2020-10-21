//Contributors: Osbaldo Martinez
//This file has the function to show the jap title of the work

//this function is used in home.hbs
let showHideJapTitle = () => {
    //make sure that the jap title has the classes jsel and hidden.
    //check that the id is jsel.
    let docSelection = document.getElementsByClassName("jsel");

    if (document.getElementById('jtShow').checked) {
        for (let i = 0; i < docSelection.length; i++) {
            //removes hidden class, so that element is shown
            docSelection[i].classList.remove("hidden");
        }
    } else {
        for (let i = 0; i < docSelection.length; i++) {
            //adds hidden class, so that element is hidden
            docSelection[i].classList.add("hidden");
        }
    }
}