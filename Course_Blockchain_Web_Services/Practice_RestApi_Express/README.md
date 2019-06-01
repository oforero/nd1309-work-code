# Blockchain Project 3 - Webservices

In this project I added a RESTful webservice on top of Project 2's blockchain code.  

I simply copied the `Block.js`, `BlockChain.js`, and `LevelSandbox.js` from the
previous project instead of trying to us an `nmp` module. I had to modify the initialization
code a little bit to avoid race condition in the record count,
I have to use even more promises than with the previous project.

I used Express to implement two endpoints `GET /block/{height}` returns the block
at that height if it exists in the database, or 404 if the block does not exist.  
A POST call to `/block/` with a string parameter named `data` adds the new block to the end of the chain, and returns the full block as a JSON string.

### Prerequisites

This simple blockchain depends on `level`, `crypto-js`, and `express`.

An application to test the web methods like `curl` or `postman`.

### Installation

```
npm install
```

## Running

To test code:
 1. Open a terminal.
 2. [OPTIONAL] Remove the `chaindata` folder, if present.
 3. Run `node app.js`
 4. Browse to `http://localhost:8000/block/0` to see the debug console for the service.
    You should see the following:
    > {"height":0,"timeStamp":"","data":"First block in the chain - Genesis block","previousHash":"0x","hash":"a9ca0750e97cd51c51bf1a2f1e81e9b6343114d9cb499bc15afc44777e4ebdc5"}

# Testing Using Curl:

1. run `curl http://localhost:8000/api/block/0`, you should see:
   > {"height":0,"timeStamp":"","data":"First block in the chain - Genesis block","previousHash":"0x","hash":"a9ca0750e97cd51c51bf1a2f1e81e9b6343114d9cb499bc15afc44777e4ebdc5"}
2. run `curl -d "data:Curl block" http://localhost:8000/api/block/`
   >{"height":1,"timeStamp":"","previousHash":"a9ca0750e97cd51c51bf1a2f1e81e9b6343114d9cb499bc15afc44777e4ebdc5","hash":"3527b5121258466f37ea2ea8b86078f7290752baab68477bebaed9e98657392f"}
3. run `curl -d "data:Curl block 2" http://localhost:8000/api/block/`
   >{"height":2,"timeStamp":"","previousHash":"3527b5121258466f37ea2ea8b86078f7290752baab68477bebaed9e98657392f","hash":"a45099bbbdd897157fdfc4b9e40af12da5a9dd8cda12817c137c882f6e7fcb64"}
4. run `curl -d "data:Curl block 2" http://localhost:8000/api/block/`
   >{"height":2,"timeStamp":"","previousHash":"3527b5121258466f37ea2ea8b86078f7290752baab68477bebaed9e98657392f","hash":"a45099bbbdd897157fdfc4b9e40af12da5a9dd8cda12817c137c882f6e7fcb64"}    
5. run `curl http://localhost:8000/api/block/1`
   >{"height":1,"timeStamp":"","previousHash":"a9ca0750e97cd51c51bf1a2f1e81e9b6343114d9cb499bc15afc44777e4ebdc5","hash":"3527b5121258466f37ea2ea8b86078f7290752baab68477bebaed9e98657392f"}
6. run `curl http://localhost:8000/api/block/2`
   >{"height":2,"timeStamp":"","previousHash":"3527b5121258466f37ea2ea8b86078f7290752baab68477bebaed9e98657392f","hash":"a45099bbbdd897157fdfc4b9e40af12da5a9dd8cda12817c137c882f6e7fcb64"}
7. run `curl http://localhost:8000/api/block/3`
   > Error block 3 does not exist in this blockchain
     
