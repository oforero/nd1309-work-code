const BlockChain = require('./BlockChain.js');
const Block = require('./Block.js');

/**
 * Controller Definition to encapsulate routes to work with blocks
 */
class BlockController {
   /**
     * Constructor to create a new BlockController, you need to initialize here all your endpoints
     * @param {*} app
     */
    constructor(app) {
        this.app = app;
        this.blocks = [];
        this.initializeMockData();
        this.getBlockByIndex();
        this.postNewBlock();
    }

    /**
     * Implement a GET Endpoint to retrieve a block by index, url: "/api/block/:index"
     */
    getBlockByIndex() {
        let self = this;
        self.app.get("/api/block/:index", (req, res) => {
            let ix = req.params.index;
            self.myBlockChain.getBlock(ix)
              .then((block) => {
                res.send(block);
              })
              .catch((err) => {
                res.status(404)        // HTTP status 404: NotFound
                  .send("Error block " + ix + " does not exist in this blockchain ");
              })
        });
    }

    /**
     * Implement a POST Endpoint to add a new Block, url: "/api/block"
     */
    postNewBlock() {
        let self = this;
        this.app.post("/api/block", (req, res) => {
            let blockData = req.body.data;
            let block = new Block.Block(blockData);
            self.myBlockChain.addBlock(block)
              .then((block) => {
                res.send(block)
              })
              .catch((err) => {
                res.send("Error creating block: " + err);
              })
        });
    }

    /**
     * Help method to inizialized Mock dataset, adds 10 test blocks to the blocks array
     */
    initializeMockData() {
        this.myBlockChain = new BlockChain.Blockchain();
        console.log("initializeMockData")
    }

}

/**
 * Exporting the BlockController class
 * @param {*} app
 */
module.exports = (app) => { return new BlockController(app);}
