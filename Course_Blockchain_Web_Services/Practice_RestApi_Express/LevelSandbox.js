/* ===== Persist data with LevelDB ==================
|  Learn more: level: https://github.com/Level/level |
/===================================================*/

const level = require('level');

class LevelSandbox {

    constructor(dbFolder) {
        let self = this;
        console.log("Creating levelDB " + dbFolder)
        self.dbFolder = dbFolder
        self.db = level(dbFolder);
    }

    initRecordCount() {
      let self = this;
      return new Promise((resolve, reject) => {
        self.getRecordCount().then((count) => {
          self.recordCount = count;
          console.log("levelDB " + self.dbFolder + " has " + self.recordCount + " records")
          resolve(count)
        }).catch((err) => reject(err))
      })
   }

   getRecordCount() {
        let self = this;
        return new Promise(function(resolve) {
          let height = -1;
          self.db.createReadStream()
            .on('data', function(data) {
              height = height + 1;
            })
            .on('end', function(data) {
              resolve(height);
            });
        });
    }

    // Get data from levelDB with key (Promise)
    getLevelDBData(key){
        let self = this;
        return new Promise((resolve, reject) => {
          self.db.get(key, (error, block) => {
            if(error) { reject(error) } else { resolve(block) }
          });
        });
    }

    // Add data to levelDB with key and value (Promise)
    addLevelDBData(key, value) {
        let self = this;
        self.recordCount = self.recordCount + 1;
        return new Promise((resolve, reject) => {
          self.db.put(key, value, (error) => {
              if(error) { reject(error) } else { resolve(value) }
          });
        });
    }

    // Method that return the height
    getBlocksCount() {
        let self = this;
        console.log("getBlocksCount")
        if(typeof self.recordCount == "undefined")
          return self.initRecordCount()
        else {
          return new Promise((resolve, reject) => resolve(self.recordCount))
        }
    }


}

module.exports.LevelSandbox = LevelSandbox;
