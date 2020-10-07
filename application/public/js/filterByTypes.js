function showHideOther() {
    let docSelection = document.getElementsByClassName("resultRow");

    if (document.getElementById('Other').checked) {
        for (let i = 0; i < docSelection.length; i++) {
            let temp = docSelection[i].getElementsByTagName("TD")[5].childNodes[0].innerText;
            if (temp != "Other") {
                docSelection[i].classList.add("hidden");
            }
        }
    } else {
        for (let i = 0; i < docSelection.length; i++) {
            let temp = docSelection[i].getElementsByTagName("TD")[5].childNodes[0].innerText;
            if (temp != "Other") {
                docSelection[i].classList.remove("hidden");
            }
        }
    }
}

function showHideTransformation() {
    let docSelection = document.getElementsByClassName("resultRow");

    if (document.getElementById('Transformation').checked) {
        for (let i = 0; i < docSelection.length; i++) {
            let temp = docSelection[i].getElementsByTagName("TD")[5].childNodes[0].innerText;
            if (temp != "Transformation") {
                docSelection[i].classList.add("hidden");
            }
        }
    } else {
        for (let i = 0; i < docSelection.length; i++) {
            let temp = docSelection[i].getElementsByTagName("TD")[5].childNodes[0].innerText;
            if (temp != "Transformation") {
                docSelection[i].classList.remove("hidden");
            }
        }
    }
}

function showHidePossession() {
    let docSelection = document.getElementsByClassName("resultRow");

    if (document.getElementById('Possession').checked) {
        for (let i = 0; i < docSelection.length; i++) {
            let temp = docSelection[i].getElementsByTagName("TD")[5].childNodes[0].innerText;
            if (temp != "Possession") {
                docSelection[i].classList.add("hidden");
            }
        }
    } else {
        for (let i = 0; i < docSelection.length; i++) {
            let temp = docSelection[i].getElementsByTagName("TD")[5].childNodes[0].innerText;
            if (temp != "Possession") {
                docSelection[i].classList.remove("hidden");
            }
        }
    }
}

function showHideBodyswap() {
    let docSelection = document.getElementsByClassName("resultRow");

    if (document.getElementById('Bodyswap').checked) {
        for (let i = 0; i < docSelection.length; i++) {
            let temp = docSelection[i].getElementsByTagName("TD")[5].childNodes[0].innerText;
            if (temp != "Bodyswap") {
                docSelection[i].classList.add("hidden");
            }
        }
    } else {
        for (let i = 0; i < docSelection.length; i++) {
            let temp = docSelection[i].getElementsByTagName("TD")[5].childNodes[0].innerText;
            if (temp != "Bodyswap") {
                docSelection[i].classList.remove("hidden");
            }
        }
    }
}