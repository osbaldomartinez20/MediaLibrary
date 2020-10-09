//Contributors: Osbaldo Martinez
//This file helps with separating the tags/links of the provided string.
//The separation is done by looking at the commas

//accepts a string and returns a list with elemnts that were  separated by commas
exports.separateLinks = function (nonSeparate) {
    let separate = [];
    let startIndex = 0;
    let i;
    for (i = 0; i < nonSeparate.length; i++) {
        if (nonSeparate.charAt(i) == ',') {
            separate.push(nonSeparate.substring(startIndex, i).replace(/ /g, ""));
            startIndex = i + 1;
        }
    }
    if (nonSeparate.charAt(i-1) != ',') {
        separate.push(nonSeparate.substring(startIndex, i + 1).replace(/ /g, ""))
    }
    return separate;
}

//accepts a string and returns a list with elemnts that were  separated by commas
exports.separateTags = function (nonSeparate) {
    let separate = [];
    let startIndex = 0;
    if (nonSeparate.charAt(startIndex) == " ") {
        startIndex++;
    }
    let i;
    for (i = 0; i < nonSeparate.length; i++) {
        if (nonSeparate.charAt(i) == ',') {
            separate.push(nonSeparate.substring(startIndex, i));
            startIndex = i + 1;
            if (nonSeparate.charAt(startIndex) == " ") {
                startIndex++;
            }
        }
    }
    if (nonSeparate.charAt(i-1) != ',') {
        separate.push(nonSeparate.substring(startIndex, i + 1));
    }
    return separate;
}