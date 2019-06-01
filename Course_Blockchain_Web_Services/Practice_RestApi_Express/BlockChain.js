/* ===== Blockchain Class ==========================
|  Class with a constructor for new blockchain 		|
|  ================================================*/

const SHA256 = require('crypto-js/sha256');
const LevelSandbox = require('./LevelSandbox.js');
const Block = require('./Block.js');

class Blockchain {

    constructor() {
      let self = this;
      console.log("Constructing block DB")
      self.bd = new LevelSandbox.LevelSandbox('./chaindata');
      self.bd.getBlocksCount().then((height) => {
        console.log("DB with " + height + " blocks")
        if(height == -1) {
          self.addBlock(self.generateGenesisBlock());
        }
      })
    }

    // Helper method to create a Genesis Block (always with height= 0)
    // You have to options, because the method will always execute when you create your blockchain
    // you will need to set this up statically or instead you can verify if the height !== 0 then you
    // will not create the genesis block
    generateGenesisBlock(){
        console.log("Creating genesis block")
        return new Block.Block("First block in the chain - Genesis block");
    }

    // Get block height, it is a helper method that return the height of the blockchain
    getBlockHeight() {
        return this.bd.getBlocksCount();
    }

    // Add new block
    addBlock(block) {
        let self = this;
        return new Promise((resolve, reject) => {
          self.bd.getBlocksCount()
            .catch(error => reject(error))
            .then((height) => {
              block.height = height + 1;
              if(block.height > 0) {
                self.getBlock(height).then((prev) => {
                  block.previousHash = prev.hash;
                  block.hash = SHA256(JSON.stringify(block)).toString();
                  self.bd.addLevelDBData(block.height, JSON.stringify(block))
                    .catch(error => reject(error))
                    .then(stored => resolve(stored))
                });
              } else {
                block.hash = SHA256(JSON.stringify(block)).toString();
                self.bd.addLevelDBData(block.height, JSON.stringify(block))
                  .catch(error => reject(error))
                  .then(stored => resolve(stored))
              }
            })
        })
    }

    // Get Block By Height
    getBlock(height) {
      let self = this;
      return self.bd.getLevelDBData(height).then(block => {
        let parsed = JSON.parse(block);
        return parsed
      })
    }

    // Validate if Block is being tampered by Block Height
    validateBlock(height) {
      let self = this;
      return self.getBlock(height).then((block) => {
        let blockHash = block.hash;
        block.hash = "";
        let expectedBlockHash = SHA256(JSON.stringify(block)).toString();
        if(blockHash == expectedBlockHash) {
          return true;
        } else {
          console.log(`Invalid Block #${height}: ${blockHash} <> ${expectedBlockHash}`);
          return false;
        }
      });
    }

    // Validate Blockchain
    validateChain() {
      let self = this;
      return new Promise((resolve, reject) => {
        const blockCount = self.getBlockHeight();
        for(let i=0; i < blockCount; i++) {
            self.validateBlock(i)
              .catch(error => reject(error))
              .then(valid => {
                if(!valid) resolve(valid);
              })
        }
        resolve(true);
      });
    }

    // Utility Method to Tamper a Block for Test Validation
    // This method is for testing purpose
    _modifyBlock(height, block) {
        let self = this;
        return new Promise( (resolve, reject) => {
            self.bd.addLevelDBData(height, JSON.stringify(block).toString()).then((blockModified) => {
                resolve(blockModified);
            }).catch((err) => { console.log(err); reject(err)});
        });
    }

}

module.exports.Blockchain = Blockchain;
