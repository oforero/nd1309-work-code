/* ===== Persist data with LevelDB ==================
|  Learn more: level: https://github.com/Level/level |
/===================================================*/

const level = require('level');
const chainDB = './chaindata';

class LevelSandbox {

    constructor() {
        let self = this;
        self.db = level(chainDB);
        self.getRecordCount().then(function(value) {
          self.height = value;
        });
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
        self.height = self.height + 1;
        return new Promise((resolve, reject) => {
          self.db.put(key, value, (error) => {
              if(error) { reject(error) } else { resolve(value) }
          });
        });
    }

    // Method that return the height
    getBlocksCount() {
        let self = this;
        return new Promise(function(resolve, reject){
            resolve(self.height);
        });
    }


}

module.exports.LevelSandbox = LevelSandbox;
