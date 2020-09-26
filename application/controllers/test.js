const typess = require("./typeController");
const cache = require('../helper/dataCache');
const queue = require('../helper/cacheQueue');
const po = require('./getPostController');

const cQueue = new queue.cacheQueue(250);

async function types() {
    /*
    console.time("time");
    let used = process.memoryUsage();
    for (let key in used) {
        console.log(`${key} ${Math.round(used[key] / 1024 / 1024 * 100) / 100} MB`);
    }
    console.timeEnd("time");
    //*/

    let cache1 = new cache.cache(po.getNumberApproved, "1", 1444);
    let cache2 = new cache.cache(po.getPostInfo, "2", 1444);
    let cache3 = new cache.cache(po.getPostInfo, "3", 1444);
    cQueue.addCache(cache1);
    cQueue.addCache(cache2);
    cQueue.addCache(cache3);
    
    cache1.getData()
        .then((result) => {
            console.log(result);
        });//*/
}

types();