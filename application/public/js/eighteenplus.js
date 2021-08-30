//Contributor: Osbaldo Martinez
//This file has the code to filter/unfilter 18+ posts
//Users cannot see 18+ posts by default

let NSFWFilter = () => {
    //0 is SFW and 1 is NSFW
    if (window.sessionStorage.getItem("NSFW") == "0") {
        window.sessionStorage.setItem("NSFW", "1");
    } else {
        window.sessionStorage.setItem("NSFW", "0");
    }
}