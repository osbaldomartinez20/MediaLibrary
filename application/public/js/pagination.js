//This file helps with the pagination of the results
const tsf = require("./filterByTypes");

//This determines the number of entries per page.
const ENTRIES_PER_PAGE = 10;

let makePagination = () => {
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
            a.href = "#"
            a.onclick = showResultsInPage(i + 1);

            if (i == 0) {
                a.classList.add("active");
            }
            document.getElementById("paginationBar").appendChild(a);
        }
    }
}


let showResultsInPage = (page) => {
    let max = page * 10;
    let min = (page * 10) - 10;

    let docSelection = document.getElementsByClassName("resultRow");

    for(let i = 0; i < docSelection.length; i++) {
        if(i >= min || i < max) {
            docSelection[i].classList.remove("hiddenP");
        } else {
            docSelection[i].classList.add("hiddenP");
        }
    }
    
}