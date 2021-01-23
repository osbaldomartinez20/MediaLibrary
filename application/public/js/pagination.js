//Contributor: Osbaldo Martinez.
//This file helps with the pagination of the results

//This determines the number of entries per page.
const ENTRIES_PER_PAGE = 10;

//function to help traverse trough the pagination
let showResultsInPage = (page, pages) => {
    let max = page * 10;
    let min = (page * 10) - 10;

    let docSelection = document.getElementsByClassName("resultRow");

    for(let i = 0; i < docSelection.length; i++) {
        if(i >= min && i < max) {
            docSelection[i].classList.remove("hiddenP");
            
        } else {
            docSelection[i].classList.add("hiddenP");
        }
    }

    if(pages > 1) {
        docSelection = document.getElementsByClassName("pageNumber");
        for(let i = 0; i < docSelection.length; i++) {
            if(page - 1 == i) {
                docSelection[i].classList.add("active");
            } else {
                docSelection[i].classList.remove("active");
            }
        }
    }
}

//function that makes the pagination
$(document).ready(function() {
    let docSelection = document.getElementsByClassName("resultRow");
    let pages = Math.ceil(docSelection.length / ENTRIES_PER_PAGE);

    for (let i = 0; i < docSelection.length; i++) {
        if (i >= ENTRIES_PER_PAGE) {
            docSelection[i].classList.add("hiddenP");
        }
    }


    if (pages > 1) {
        for (let i = 0; i < pages; i++) {

            let a = document.createElement('a');
            a.appendChild(document.createTextNode((i + 1) + ""));
            a.title = (i + 1) + "";
            a.classList.add("pageNumber");
            a.href = "#"
            a.setAttribute("onclick", "showResultsInPage(" + (i + 1) + "," + pages + ")")

            if (i == 0) {
                a.classList.add("active");
            }
            document.getElementById("paginationBar").appendChild(a);
        }
    }
});