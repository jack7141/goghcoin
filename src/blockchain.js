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
    0,
    "d7d0b47b27a2d9061b55356f5ace714fc121a9e7fa0aa4e6e3972bd408b1a332",
    null,
    1520962144289,//new date().getTime()
    "This is the genesis!!"
);

let blockchain = [genesisBlock];

const getLastBlock = () => blockchain[blockchain.length -1];

const getTimestamp =() => new Date().getTime()/1000;
//암호학 크리토js를 불러오면 인풋을 해줘야한다. 그래서 인덱스 프리브우스 해쉬 등을 넣어주고 바로 리턴 =>해서 받아준다.
const createHash = (index , previousHash, timestamp, data) =>
    CryptoJS.SHA256(index + previousHash + timestamp + JSON.stringify(data)).toString();//data를 스트링으로 변환시켜주는건 숫자로도 데이터를 넣을수 있게함으로!, 그러나 투스트링으로 변환시켜준다고 생각할수 있느데 insNewStructureValid함수에서 각각 검사를 하므로 스트링으로 변환시켜주는게 안정적이다.

//새로운 블록을 생성하는 함수를 만들어준다~    
const createNewBlock = data => {
    const previousBlock = getLastBlock();
    const newBlockIndex = previousBlock.index + 1;//기존의 블록말고 그 다음 블록에 데이터를 넣어야 하므로 +1을 해준다.
    const newTimestamp = getTimestamp();
    const newHash = createHash(
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
    return newBlock;
};

const getBlockHash = block =>
    createHash(block.index, block.previousBlock, block.timestamp, block.data);

const isNewBlockValid = (candidateBlock, laststBlock) => {
    if(!isNewBlockValid(candidateBlock)){
        console.log("The candidate block structure is not valid");
        return false;
    }
    else if(laststBlock.index + 1 !== laststBlock.index){
        console.log("다음 블록이 순서에 맞지 않습니다.");
        return false;
    }
    else if(laststBlock.hash !== candidateBlock.hash){
        console.log("이전 해쉬와 다음블록과 다음 해쉬 브록이 다릅니다.");
        return false
    }
    else if(getBlockHash(candidateBlock) !== candidateBlock.hash){
        console.log("The hash of this block is invalid");
        return false;
    }
    return true;
};

//블록의 구조를 검증하는 펑션을 하나 만든다.
const isNewStructureValid = block => {
    return (
        typeof block.index === "number" &&
        typeof block.hash ==="string"&&
        typeof block.previousHash ==="string"&&
        typeof block.timestamp ==="number"&&
        typeof block.data ==="string"
    );
};


const isChainValid = candidateChain => {
    const isGenesisValid = block => {
        return JSON.stringify(block) === JSON.stringify(genesisBlock);
    };
    if(!isGenesisValid(candidateChain[0])){
        console.log("The candidateChains's genesisBlock is not the same as or genesisBlock");
    return false;
    }
    for(let i = 1; i < candidateChain.length; i++){
        if(!isNewBlockValid(candidateChain[i], candidateChain[i - 1])){
            return false;
        }
    }
return true;
};
//