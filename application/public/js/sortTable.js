//Contributor: Osbaldo Martinez.

//parameter is an int that helps identify what you are sorting
//n = 1, sort by titles. n = 2, sort by author. Default might do nothing.
let sortTable = (n) => {
    let  i, x, y, shouldSwitch, switchcount = 0;
    let table = document.getElementById("resultTable");
    let switching = true;
    let dir = "asc";
    while (switching) {
        switching = false;
        let rows = table.rows;
        for (i = 1; i < (rows.length - 1); i++) {
            shouldSwitch = false;
            if (n == 1) {
                x = rows[i].getElementsByTagName("TD")[1].innerText;
                y = rows[i + 1].getElementsByTagName("TD")[1].innerText;
            } else if (n == 2) {
                x = rows[i].getElementsByTagName("TD")[2].innerText;
                y = rows[i + 1].getElementsByTagName("TD")[2].innerText;
            } else {
                x = "";
                y = "";
            }
            if (dir == "asc") {
                if (x.toLowerCase() > y.toLowerCase()) {
                    shouldSwitch = true;
                    break;
                }
            } else if (dir == "desc") {
                if (x.toLowerCase() < y.toLowerCase()) {
                    shouldSwitch = true;
                    break;
                }
            }
        }
        if (shouldSwitch) {
            rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
            switching = true;
            switchcount++;
        } else {
            if (switchcount == 0 && dir == "asc") {
                dir = "desc";
                switching = true;
            }
        }
    }
}