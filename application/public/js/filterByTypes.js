var typeList = ["Bodyswap(入れ替わり)","Possession(憑依)","Transformation(他者変身)","Other"];
//Contributors: Osbaldo Martinez
//This file contains the functions that help filtering the results.

//paramater is an int with id of the type you want to filter for. Used in home.hbs
function showHide(typeId) {
let typeIndex = typeId - 1;
let docSelection = document.getElementsByClassName("resultRow");
if (document.getElementById(typeList[typeIndex]).checked) {
for (let i = 0; i < docSelection.length; i++) {
let temp = docSelection[i].getElementsByTagName("TD")[3].childNodes[0].innerText;
console.log(temp);
if (temp != typeList[typeIndex]) {
if (!document.getElementById(temp).checked) {
docSelection[i].classList.add("hidden");
}} else {
docSelection[i].classList.remove("hidden");
}}} else {
for (let i = 0; i < docSelection.length; i++) {
let temp = docSelection[i].getElementsByTagName("TD")[3].childNodes[0].innerText;
if (atLeastOneChecked()) {
if (document.getElementById(temp).checked) {
docSelection[i].classList.remove("hidden");
} else {
docSelection[i].classList.add("hidden");
}} else {
docSelection[i].classList.remove("hidden");
}}}}


//function used to check if there is another type being checked off
function atLeastOneChecked() {
let checked = false;
for (let i = 0; i < typeList.length; i++) {
if (document.getElementById(typeList[i]).checked) {
checked = true;
break;
}}
return checked;}

//Any changes in this file should be done in the string functionFilterByType in rewriteFilterFunction.js
