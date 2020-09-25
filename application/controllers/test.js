let typess = require("./typeController");
let cache = require('./cacheController');

async function types() {
    const typesCache = new cache.cache(typess.retrieve, 0.05);
    typesCache.getData()
        .then((result) => {
            let types = [];
            for (let i = 0; i < result.length; i++) {
                types.push(result[i]);
            }
            console.log(result);
        });//*/
    setTimeout(typesCache.getData, 0);
    setTimeout(typesCache.getData, 1000);
    setTimeout(typesCache.getData, 2000);
    setTimeout(typesCache.getData, 3000);
    setTimeout(typesCache.getData, 4000);
    setTimeout(typesCache.getData, 5000);
    setTimeout(typesCache.getData, 6000);
}

types();