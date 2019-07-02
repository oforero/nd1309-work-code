const StarNotary = artifacts.require("StarNotary");

var accounts;
var owner;

contract('StarNotary', (accs) => {
    accounts = accs;
    owner = accounts[0];
});

it('can Create a Star', async() => {
    let tokenId = 1;
    let instance = await StarNotary.deployed();
    await instance.createStar('Awesome Star!', tokenId, {from: accounts[0]})
    assert.equal(await instance.tokenIdToStarInfo.call(tokenId), 'Awesome Star!')
});

it('lets user1 put up their star for sale', async() => {
    let instance = await StarNotary.deployed();
    let user1 = accounts[1];
    let starId = 2;
    let starPrice = web3.utils.toWei(".01", "ether");
    await instance.createStar('awesome star', starId, {from: user1});
    await instance.putStarUpForSale(starId, starPrice, {from: user1});
    assert.equal(await instance.starsForSale.call(starId), starPrice);
});

it('lets user1 get the funds after the sale', async() => {
    let instance = await StarNotary.deployed();
    let user1 = accounts[1];
    let user2 = accounts[2];
    let starId = 3;
    let starPrice = web3.utils.toWei(".01", "ether");
    let balance = web3.utils.toWei(".05", "ether");
    await instance.createStar('awesome star', starId, {from: user1});
    await instance.putStarUpForSale(starId, starPrice, {from: user1});
    let balanceOfUser1BeforeTransaction = await web3.eth.getBalance(user1);
    await instance.buyStar(starId, {from: user2, value: balance});
    let balanceOfUser1AfterTransaction = await web3.eth.getBalance(user1);
    let value1 = Number(balanceOfUser1BeforeTransaction) + Number(starPrice);
    let value2 = Number(balanceOfUser1AfterTransaction);
    assert.equal(value1, value2);
});

it('lets user2 buy a star, if it is put up for sale', async() => {
    let instance = await StarNotary.deployed();
    let user1 = accounts[1];
    let user2 = accounts[2];
    let starId = 4;
    let starPrice = web3.utils.toWei(".01", "ether");
    let balance = web3.utils.toWei(".05", "ether");
    await instance.createStar('awesome star', starId, {from: user1});
    await instance.putStarUpForSale(starId, starPrice, {from: user1});
    let balanceOfUser1BeforeTransaction = await web3.eth.getBalance(user2);
    await instance.buyStar(starId, {from: user2, value: balance});
    assert.equal(await instance.ownerOf.call(starId), user2);
});

it('lets user2 buy a star and decreases its balance in ether', async() => {
    let instance = await StarNotary.deployed();
    let user1 = accounts[1];
    let user2 = accounts[2];
    let starId = 5;
    let starPrice = web3.utils.toWei(".01", "ether");
    let balance = web3.utils.toWei(".05", "ether");
    await instance.createStar('awesome star', starId, {from: user1});
    await instance.putStarUpForSale(starId, starPrice, {from: user1});
    let balanceOfUser1BeforeTransaction = await web3.eth.getBalance(user2);
    const balanceOfUser2BeforeTransaction = await web3.eth.getBalance(user2);
    await instance.buyStar(starId, {from: user2, value: balance, gasPrice:0});
    const balanceAfterUser2BuysStar = await web3.eth.getBalance(user2);
    let value = Number(balanceOfUser2BeforeTransaction) - Number(balanceAfterUser2BuysStar);
    assert.equal(value, starPrice);
});

// Implement Task 2 Add supporting unit tests

it('can add the star name and star symbol properly', async() => {
    const notary = await StarNotary.deployed();

    // 1. create a Star with different tokenId
    const tokenId = 4242
    await notary.createStar(`Test star ${tokenId}`, tokenId, {from: accounts[0]});
    const result = await notary.tokenIdToStarInfo.call(tokenId);
    assert.equal(result, `Test star ${tokenId}`);
    //2. Call the name and symbol properties in your Smart Contract and compare with the name and symbol provided
    const name = await notary.name.call();
    assert.equal(name, "Imperial Ownership Certificate")
    const symbol = await notary.symbol.call();
    assert.equal(symbol, "IOC")
});

it('lets 2 users exchange stars', async() => {
    const notary = await StarNotary.deployed();

    // 1. create 2 Stars with different tokenId
    const tokenId1 = 333
    await notary.createStar(`Test star ${tokenId1}`, tokenId1, {from: accounts[0]});
    const tokenId2 = 666
    await notary.createStar(`Test star ${tokenId2}`, tokenId2, {from: accounts[1]});
    // 2. Call the exchangeStars functions implemented in the Smart Contract
    await notary.exchangeStars(tokenId1, tokenId2, {from: accounts[0]});

    // 3. Verify that the owners changed
    const ownerOfStar1 = await notary.ownerOf.call(tokenId1);
    assert.equal(ownerOfStar1, accounts[1]);

    const ownerOfStar2 = await notary.ownerOf.call(tokenId2);
    assert.equal(ownerOfStar2, accounts[0]);
});

it('lets a user transfer a star', async() => {
    const notary = await StarNotary.deployed();
    // 1. create a Star with different tokenId
    const tokenId = 444
    await notary.createStar(`Test star ${tokenId}`, tokenId, {from: accounts[0]});

    // 2. use the transferStar function implemented in the Smart Contract
    await notary.transferStar(accounts[2], tokenId,  {from: accounts[0]});
   
    // 3. Verify the star owner changed.
    const ownerOfStar = await notary.ownerOf.call(tokenId);
    assert.equal(ownerOfStar, accounts[2]);
});

it('lookUptokenIdToStarInfo test', async() => {
    const notary = await StarNotary.deployed();
    // 1. create a Star with different tokenId
    const tokenId = 555
    await notary.createStar(`Test star ${tokenId}`, tokenId, {from: accounts[0]});

    // 2. Call your method lookUptokenIdToStarInfo
    const starInfo = await notary.lookUptokenIdToStarInfo.call(tokenId,  {from: accounts[5]});

    // 3. Verify if you Star name is the same
    assert.equal(starInfo, `Test star ${tokenId}`);
});