//Contributor: Osbaldo Martinez

//this function filters the results of a table by using typed input.
//the parameter n is a number that indicates the column index starting at 0.
let filterId = (n) => {
    let search = document.getElementById("idSearch");
    let partialId = search.value.toLowerCase();
    let table = document.getElementById("postTable");
    let tr = table.getElementsByTagName("tr");

    for (let i = 1; i < tr.length; i++) {
        let td = tr[i].getElementsByTagName("TD")[n];
        let pid = td.innerText;

        if (pid.includes(partialId)) {
            tr[i].classList.remove("hidden");
        } else {
            tr[i].classList.add("hidden");
        }
    }
}