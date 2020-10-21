const fs = require('fs');
const types = require('../controllers/typeController');

const functionFilterByType = 
"//Contributors: Osbaldo Martinez\n//This file contains the functions that help filtering the results.\n\n//paramater is an int with id of the type you want to filter for. Used in home.hbs\n" +
"let showHide = (typeId) => {\nlet typeIndex = typeId - 1;\nlet docSelection = document.getElementsByClassName(\"resultRow\");\nif (document.getElementById(typeList[typeIndex]).checked) {\nfor (let i = 0; i < docSelection.length; i++) {\nlet temp = docSelection[i].getElementsByTagName(\"TD\")[3].childNodes[0].innerText;\nif (temp != typeList[typeIndex]) {\nif (!document.getElementById(temp).checked) {\ndocSelection[i].classList.add(\"hidden\");\n}} else {\ndocSelection[i].classList.remove(\"hidden\");\n}}} else {\nfor (let i = 0; i < docSelection.length; i++) {\nlet temp = docSelection[i].getElementsByTagName(\"TD\")[3].childNodes[0].innerText;\nif (atLeastOneChecked()) {\nif (document.getElementById(temp).checked) {\ndocSelection[i].classList.remove(\"hidden\");\n} else {\ndocSelection[i].classList.add(\"hidden\");\n}} else {\ndocSelection[i].classList.remove(\"hidden\");\n}}}}\n\n\n" +
"//function used to check if there is another type being checked off\n"+
"let atLeastOneChecked = () => {\nlet checked = false;\nfor (let i = 0; i < typeList.length; i++) {\nif (document.getElementById(typeList[i]).checked) {\nchecked = true;\nbreak;\n}}\nreturn checked;}\n\n" +
"//Any changes in this file should be done in the string functionFilterByType in rewriteFilterFunction.js";

exports.writeFunction = () => {
    types.retrieve()
    .then((result) => {
        let functionToWrite = "var typeList = [";
        let i;
        for (i = 0; i < result.length-1; i++) {
            functionToWrite = functionToWrite + "\"" + result[i].name + "\",";
        }
        functionToWrite = functionToWrite + "\"" + result[i].name + "\"";
        functionToWrite += "];\n";
        functionToWrite += functionFilterByType;
        fs.unlink('./public/js/filterByTypes.js', (err) => {
            if(err) {
                fs.writeFileSync(__dirname + '/errors/' + Date.now() + 'error.log', err + '');
            }
            fs.writeFileSync('./public/js/filterByTypes.js', functionToWrite);
        });
        
    });
}