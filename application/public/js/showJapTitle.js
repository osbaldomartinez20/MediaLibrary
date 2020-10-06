

function showHideJapTitle() {
    let docSelection = document.getElementsByClassName("jsel");

    if (document.getElementById('jtShow').checked) {
        for (let i = 0; i < docSelection.length; i++) {
            docSelection[i].classList.remove("jt");
        }
    } else {
        for (let i = 0; i < docSelection.length; i++) {
            docSelection[i].classList.add("jt");
        }
    }
}