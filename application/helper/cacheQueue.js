//This class is wrappes around array methods.
//This Queue is used to hold caches for the resulting data from the SQL queries.
//You can declare a limit otherwise default limit is 10.
//All methods are compatible with DataCache objects.
class CacheQueue {
    constructor(limit = 10) {
        this.cQueue = [];
        this.limit = limit;
        this.addCache = this.addCache.bind(this);
        this.removeCacheById = this.removeCacheById.bind(this);
        this.getCacheById = this.getCacheById.bind(this);
        this.getCacheIndexById = this.getCacheIndexById.bind(this);
    }
    //adds a new cache to the end of the queue and removes the caches at the front if the limit is surpassed.
    addCache(newCache) {
        let index = this.getCacheIndexById(newCache.id)
        if (index  != -1) {
            this.cQueue[index] = newCache;
        } else {
            this.cQueue.push(newCache);
            if (this.cQueue.length > this.limit) {
                this.cQueue.shift();
            }
        }
    }
    //removes the cache with the given id from the queue 
    removeCacheById(id) {
        for (let i = 0; i < this.cQueue.length; i++) {
            if (this.cQueue[i].id == id) {
                this.cQueue.splice(i, 1);
                return;
            }
        }
    }
    //returns the cache with the given id.
    //can be used to see if cache exists by seeing if return value is not undefined
    getCacheById(id) {
        for (let i = 0; i < this.cQueue.length; i++) {
            if (this.cQueue[i].id == id) {
                return this.cQueue[i];
            }
        }
        return undefined;
    }
    //Returns the index of the cached with the given id.
    getCacheIndexById(id) {
        for (let i = 0; i < this.cQueue.length; i++) {
            if (this.cQueue[i].id == id) {
                return i;
            }
        }
        return -1;
    }
}

exports.cacheQueue = CacheQueue;