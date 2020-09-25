//DataCache class take from a blog in mojotech
//link: https://www.mojotech.com/blog/node-js-memory-cache/
//Any modifications were made by Osbaldo Martinez

class DataCache {

    //contructor that only requires a function passed for where the cached data comes from.
    //an optional paramater of how many minutes the cache should live for.
    constructor(fetchFunction, minutesToLive = 10) {
      this.millisecondsToLive = minutesToLive * 60 * 1000;
      this.fetchFunction = fetchFunction;
      this.cache = null;
      this.getData = this.getData.bind(this);
      this.resetCache = this.resetCache.bind(this);
      this.isCacheExpired = this.isCacheExpired.bind(this);
      this.destroyCache = this.destroyCache.bind(this);
      this.fetchDate = new Date(0);
    }

    //checks to see if cache is expired
    isCacheExpired() {
      return (this.fetchDate.getTime() + this.millisecondsToLive) < new Date().getTime();
    }

    //it gets the cached data or it caches new data if it does not exist
    getData() {
      if (!this.cache || this.isCacheExpired()) {
        console.log('expired - fetching new data');
        return this.fetchFunction()
          .then((data) => {
          this.cache = data;
          this.fetchDate = new Date();
          return data;
        });
      } else {
        console.log('cache hit');
        return Promise.resolve(this.cache);
      }
    }

    //it resets the current cached
    resetCache() {
     this.fetchDate = new Date(0);
    }

    //destroys the current cached data because of the isCacheExpired method.
    destroyCache() {
        this.millisecondsToLive = 0;
    }

}

exports.cache = DataCache;