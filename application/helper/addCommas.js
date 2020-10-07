//this file has a function to add commas to the tags and links
//for the edit page, so that they can be properly rsubmitted.

//this function takes a list of links and returns a string that separates each
//element with a comma.
exports.addCommasLinks = function(listOfStrings) {
    let retString = "";
    for (let i = 0; i < listOfStrings.length; i++) {
        
        if (i == listOfStrings.length-1) {
            retString += listOfStrings[i].links
        } else {
            retString += listOfStrings[i].links + ", "
        }
    }
    return retString;
}

//this function takes a list of tags and returns a string that separates each
//element with a comma.
exports.addCommasTags = function(listOfStrings) {
    let retString = "";
    for (let i = 0; i < listOfStrings.length; i++) {
        
        if (i == listOfStrings.length-1) {
            retString += listOfStrings[i].tags
        } else {
            retString += listOfStrings[i].tags + ", "
        }
    }
    return retString;
}