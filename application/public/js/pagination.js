//This file helps with the pagination of the results
const tsf = require("./filterByTypes");

//This determines the number of entries per page.
const ENTRIES_PER_PAGE = 10;

let makePagination = () => {
    let docSelection = document.getElementsByClassName("resultRow");
    let filtered = checkFilter();
    let pages = Math.ceil(docSelection.length / ENTRIES_PER_PAGE);

    if (filtered) {
        for (let i = 0; i < docSelection.length; i++) {
            let temp = docSelection[i].getElementsByTagName("TD")[3].childNodes[0].innerText;
            if (!document.getElementById(temp).checked || i >= ENTRIES_PER_PAGE) {
                docSelection[i].classList.add("hiddenP");
            }
        }
    } else {
        for (let i = 0; i < docSelection.length; i++) {
            if(i >= ENTRIES_PER_PAGE) {
                docSelection[i].classList.add("hiddenP");
            }
        }
    }

    if(pages > 1) {
        for (let i = 0; i < pages; i++) {

            let a = document.createElement('a');
            a.appendChild(document.createTextNode((i + 1) + ""));
            a.title = (i+1) + "";
            a.href = "#"
            a.onclick = showResultsInPage(i+1);

            if(i == 0) {
                a.classList.add("active");
            }
            document.getElementById("paginationBar").appendChild(a);
        }
    }
}

let checkFilter = () => {
    for (let i = 0; i < tsf.types.length; i++) {
        if (document.getElementById(tsf.types[i]).checked) {
            return true;
        }
    }
    return false;
}

let showResultsInPage = (page) => {

}