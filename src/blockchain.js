const CryptoJS = require("crypto-js");//암호악에 쓰이느는 것 yarn add cropyo js

class Block{
    constructor(index, hash, previousHash, timestamp, data){//블록구조를 만들고 내부에 해쉬를 만드는 과정이였다. 해쉬는 수학함수로서 입력값을 넣으면 아웃풋이 생김
        this.index = index;
        this.hash =  hash;
        this.previousHash = previousHash;
        this.timestamp = timestamp;
        this.data = data;
    }
}

const genesisBlock = new Block(
    0,//인덱스
    "d7d0b47b27a2d9061b55356f5ace714fc121a9e7fa0aa4e6e3972bd408b1a332",//해쉬
    null,//프리비우스 해쉬
    1520962144289,//new date().getTime()  타임스탬프
    "This is the genesis!!"//데이터
);

let blockchain = [genesisBlock];

const getLastBlock = () => blockchain[blockchain.length -1];

const getTimestamp =() => new Date().getTime()/1000;

const getBlockchain = () => blockchain;


//암호학 크리토js를 불러오면 인풋을 해줘야한다. 그래서 인덱스 프리브우스 해쉬 등을 넣어주고 바로 리턴 =>해서 받아준다.
const createHash = (index , previousHash, timestamp, data) =>
    CryptoJS.SHA256(index + previousHash + timestamp + JSON.stringify(data)).toString();//data를 스트링으로 변환시켜주는건 숫자로도 데이터를 넣을수 있게함으로!, 그러나 투스트링으로 변환시켜준다고 생각할수 있느데 insNewStructureValid함수에서 각각 검사를 하므로 스트링으로 변환시켜주는게 안정적이다.

//새로운 블록을 생성하는 함수를 만들어준다~    
const createNewBlock = data => {
    const previousBlock  = getLastBlock();
    const newBlockIndex  = previousBlock.index + 1;//기존의 블록말고 그 다음 블록에 데이터를 넣어야 하므로 +1을 해준다.
    const newTimestamp  = getTimestamp();
    const newHash  = createHash(
        newBlockIndex,
        previousBlock.hash,
        newTimestamp,
        data
    );
    const newBlock = new Block(
        newBlockIndex,
        newHash,
        previousBlock.hash,
        newTimestamp,
        data
    );
    addBlockToChain(newBlock);
    return newBlock;
};

const getBlocksHash = block =>
   createHash(block.index, block.previousHash, block.timestamp, block.data);
 
 const isNewBlockValid = (candidateBlock, latestBlock) => {
   if (!isNewStructureValid(candidateBlock)) {
     console.log("The candidate block structure is not valid");
     return false;
   } else if (latestBlock.index + 1 !== candidateBlock.index) {
     console.log("The candidate block doesnt have a valid index");
     return false;
   } else if (latestBlock.hash !== candidateBlock.previousHash) {
     console.log(
       "The previousHash of the candidate block is not the hash of the latest block"
     );
     return false;
   } else if (getBlocksHash(candidateBlock) !== candidateBlock.hash) {
     console.log("The hash of this block is invalid");
     return false;
   }
   return true;
 };
 //블록의 구조를 검증하는 펑션을 하나 만든다.
 const isNewStructureValid = block => {
   return (
     typeof block.index === "number" &&
     typeof block.hash === "string" &&
     typeof block.previousHash === "string" &&
     typeof block.timestamp === "number" &&
     typeof block.data === "string"
   );
 };
 
//체인을 검증하기 위함, 타인에게 릴리즈했을경우 교체?하기 위함??......
//두개의 블록체인은 같은 하나의 제네시스 출신이어야 한다..!!매우중요!!

 const isChainValid = candidateChain => {
   const isGenesisValid = block => {
     return JSON.stringify(block) === JSON.stringify(genesisBlock);
   };
   if (!isGenesisValid(candidateChain[0])) {
     console.log(
       "The candidateChains's genesisBlock is not the same as our genesisBlock"
     );
     return false;
   }
   //블록은 첫번째는 체크하지 않는다 첫번째 블록은 제네시스 블록 즉 최초의 블록이므로 건들지 않고 두번쨰 블록부터 검사한다.
   for (let i = 1; i < candidateChain.length; i++) {
     if (!isNewBlockValid(candidateChain[i], candidateChain[i - 1])) {
       return false;
     }
   }
   return true;
 };
 //블록체인이 유효하다면 교환을 해주는 함수를 만들어 줘야함
 const replaceChain = candidateChain => {
   if (
     isChainValid(candidateChain) &&
     candidateChain.length > getBlockchain().length
   ) {
     blockchain = candidateChain;
     return true;
   } else {
     return false;
   }
 };
 
 const addBlockToChain = candidateBlock => {
   if (isNewBlockValid(candidateBlock, getLastBlock())) {
     blockchain.push(candidateBlock);
     return true;
   } else {
     return false;
   }
 };
//서버를 생성하기전에 export를 해줘야한다.
module.exports = {
  getBlockchain,
  createNewBlock
};