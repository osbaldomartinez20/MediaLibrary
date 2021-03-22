//This file helps with the pagination of the results
//This determines the number of entries per page.
const ENTRIES_PER_PAGE = 10;

//makes the pagination based on the number of results given by the backend.
let makePagination = () => {
    let hidden = hideShowNSFW();


    let docSelection = document.getElementsByClassName("resultRow");
    let pages = Math.ceil((docSelection.length - hidden) / ENTRIES_PER_PAGE);

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

//shows the results of the selected page.
let showResultsInPage = (page) => {
    let max = page * 10;
    let min = (page * 10) - 10;

    let docSelection = document.getElementsByClassName("resultRow");

    for (let i = 0; i < docSelection.length; i++) {
        if (i >= min || i < max) {
            docSelection[i].classList.remove("hiddenP");
        } else {
            docSelection[i].classList.add("hiddenP");
        }
    }

}

let remakePagination = () => {
    let docSelection = document.getElementById("paginationBar");

    for (let i = 0; i < docSelection.length; i++) {
        docSelection[i].remove();
    }
}

let hideShowNSFW = () => {
    let NSFW = document.getElementsByClassName("NSFW");

    for (let i = 0; i < NSFW.length; i++) {
        if (window.sessionStorage.getItem("NSFW") == "0") {
            NSFW[i].classList.add("hiddenN");
        } else {
            NSFW[i].classList.remove("hiddenN");
        }
    }

    let count = 0;
    if (window.sessionStorage.getItem("NSFW") == "0") {
        count = NSFW.length;
    }
    
    return count;
}