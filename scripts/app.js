const rowNumber = 7;
const colNumber = 10;
const minesNumber = 15;
let remainMins = minesNumber;

const logger = (arr) => {
    let str = '';
    for (let i = 0; i < arr.length; i++) {
        str += '| ';
        for (let j = 0; j < arr[0].length; j++) {
            str += arr[i][j] + ' | ';
        }
        str += '\n';
    }
    console.log(str);
};


document.querySelector('.mins-number').innerHTML = remainMins;

// class BoardUnit {
//     value;
//     vissible = false;
// }

// class GameBoard {
//     rowNumber = 10;
//     colNumber = 15;
//     minesNumber =20;
//     gameArray;
// }

const gameArray = new Array(rowNumber).fill(0).map(() => new Array(colNumber).fill(0));

const gameStateArray = new Array(rowNumber).fill(false).map(() => new Array(colNumber).fill(false));
// console.log(gameStateArray);

console.log(gameArray);

const createBoardUI = () => {
    const boardContainer = document.querySelector('.game-board');
    let i, j;
    i = 0;
    for(const row of gameArray) {
        j = 0;
        for(const elm of row) {
            const boardItem = document.createElement('div');
            boardItem.classList.add('game-board-item');
            boardItem.id = `${i}-${j}`;
            // boardItem.textContent = 'a';
            boardContainer.append(boardItem);
            j++;
        }
        i++;
    }
};

// random number between 0 and number that is input and it is exclude
const randomIndexUpToNumber = (num) => {
    return Math.floor(Math.random() * num);
};

//  create array for pick mines in location of created in below
let existLocation = [];
let gameArrayLength = gameArray.length;
let gameColLength = gameArray[0].length;

const createExistLocationArr = () => {
    let indexArray = 0;
    
    for(let i = 0; i < gameArrayLength; i++) {
        for(let j = 0; j < gameColLength; j ++){
            existLocation[indexArray] = [i, j];
            indexArray++;
        }
    }
};

const locatedMinesInGameArray = () => {
    createExistLocationArr();
    for(let i = 0; i < minesNumber; i++) {
        let rndIndex = randomIndexUpToNumber(existLocation.length - 1);
        let rowGameArray = existLocation[rndIndex][0];
        let colGameArray = existLocation[rndIndex][1];
        existLocation.splice(rndIndex, 1);
        gameArray[rowGameArray][colGameArray] = 'x';
    }
};

const setNumberSurroundOfMines = () => {
    for(let i = 0; i < gameArrayLength; i++) {
        for(let j = 0; j < gameColLength; j++) {
            if(gameArray[i][j] === 'x') {
                continue;
            }
            let count = 0;
            for(let k = i -1; k <= i + 1; k++) {
                for(let l = j - 1; l <= j + 1; l++) {
                    // k and l if not in range of board should code conitue
                    if(!((k >= 0 && k < gameArrayLength) && (l >= 0 && l < gameColLength))) {
                        continue;
                    }
                    if(gameArray[k][l] === 'x') {
                        count++;
                    }
                }
            }
            gameArray[i][j] = count;
        }
        
    }
};

const initializeBoard = () => {
    createBoardUI();
    locatedMinesInGameArray();
    setNumberSurroundOfMines();
};

initializeBoard();

//  ----- WORK ON UI -------

//  Add event listener on board item
const boardItems = document.querySelectorAll('.game-board  div');

disableClickAndContextmenu = (row, col) => {
    document.getElementById(`${row}-${col}`).removeEventListener('click', itemClickHandler);
    document.getElementById(`${row}-${col}`).removeEventListener('contextmenu', itemRightClickHandler);
};

const updateMinesNumberUi = () => {
    const remainsMinsHeader = document.querySelector('.mins-number');
    remainsMinsHeader.innerHTML = remainMins;
};

const gameOver = (itm) => {
    // console.log('you are game over');

    itm.style.color = '#ff0000';

    for(const item of boardItems) {
        // delete event listener from all elements when user clicked on any mines
        let itemIndexArray = item.id.split('-');
        disableClickAndContextmenu(itemIndexArray[0], itemIndexArray[1]);  
        let itemContent = gameArray[itemIndexArray[0]][itemIndexArray[1]];
        // item.classList.add('reset-color-items');
        if(itemContent === 'x') {
            item.innerHTML = 'x';
        }
    }
};

const emptyZeroElement = (rowIdx, colIdx) => {
    //  arguments is string and we have to change them to number
    let rIdx = +rowIdx;
    let cIdx = +colIdx;
    gameArray[rIdx][cIdx] = 'r';
    
    gameStateArray[rIdx][cIdx] = true;   //  Update gameStateArray
    if(document.getElementById(`${rIdx}-${cIdx}`).innerHTML === 'B') {
        remainMins++;
        updateMinesNumberUi();
    }
    disableClickAndContextmenu(rIdx,cIdx);
    
    for(let i = rIdx - 1; i <= rIdx + 1; i++) {
        for(let j = cIdx -1; j <= cIdx + 1; j++) {
            if(!((i >= 0 && i < gameArrayLength) && (j >= 0 && j < gameColLength))) {   //  for reliza that item is exist in between arrayLength and arrayColLength
                continue;
            }
            if(gameArray[i][j] > 0) {   //  if element is number grater than zero, show number to user and continue after steps
                if(document.getElementById(`${i}-${j}`).innerHTML === 'B') {
                    remainMins++;
                    updateMinesNumberUi();
                }
                gameStateArray[i][j] = true;   //  Update gameStateArray
                document.getElementById(`${i}-${j}`).textContent = gameArray[i][j];
                disableClickAndContextmenu(i, j);
                continue;
            }
            if(gameArray[i][j] === 'r') {   //  for same element zero that is clicked
                document.getElementById(`${i}-${j}`).textContent = '';
                document.getElementById(`${i}-${j}`).classList.add('game-board-empty-item');
                continue;
            }
            if(gameArray[i][j] === 0) {
                emptyZeroElement(i, j);
            }
        }
    }
};

const diagnoseWinningUser = () => {
    let count = 0;  //  number of items that now is not visible(0 or number or flag(B))

    for(const row of gameStateArray) {
        for(const col of row) {
            if(col === false) count++;
        }
    }

    let numberUnvisitedItem = count;
    let correctLocatedMins;

    let i = 0;
    for(const row of gameStateArray) {
        let j = 0
        for(const state of row) {
            if(state === 'Bomb' && gameArray[i][j] === 'x') {
                correctLocatedMins =  true;
            } else if(state === 'Bomb' && gameArray[i][j] !== 'x') {
                correctLocatedMins =  false;
            }
            j++;
        }
        i++;
    }
    // console.log(correctLocatedMins);

    if(numberUnvisitedItem <= remainMins && correctLocatedMins) {
        console.log('show user other bombs');
        console.log('user win');

        let i = 0;
        for(const row of gameStateArray) {
            let j = 0;
            for (const state of row) {
                disableClickAndContextmenu(i, j);
                if(state === false || state === 'Bomb') {
                    gameStateArray[i][j] = 'Bomb';
                    document.getElementById(`${i}-${j}`).innerHTML = 'Y';
                }
                j++;
            }
            i++;
        }

        console.log(gameStateArray);

        remainMins = 0;
        updateMinesNumberUi();
    }
};

const itemClickHandler = event => {
    // console.log('clicked');
    let itemIndexArray = event.currentTarget.id.split('-');
    let rowItemIndex = itemIndexArray[0];
    let colItemIndex = itemIndexArray[1];
    let itemContent = gameArray[rowItemIndex][colItemIndex];
    event.currentTarget.textContent = itemContent;

    if(itemContent === 'x') {
        gameOver(event.currentTarget);
    } else if(itemContent === 0) {
        emptyZeroElement(rowItemIndex, colItemIndex);
        diagnoseWinningUser();
    } else if(itemContent > 0) {
        gameStateArray[rowItemIndex][colItemIndex] = true;
        disableClickAndContextmenu(rowItemIndex, colItemIndex);
        diagnoseWinningUser();
    }
    
    // logger(gameArray);
    // console.log(gameStateArray);
};

// disable the right click on the game-board container for handle right click on board items
document.querySelector('.game-board').addEventListener('contextmenu', event => {
    event.preventDefault();
});

const itemRightClickHandler = event => {
    // console.log('right click');
    
    let itemIndexArray = event.currentTarget.id.split('-');
    let rIdx = itemIndexArray[0];
    let cIdx = itemIndexArray[1];
    let itemContent = gameArray[itemIndexArray[0]][itemIndexArray[1]];  // itemContent show reality of this item, that is exist on gameArray

    if(event.currentTarget.innerHTML === '' && remainMins > 0) {
        event.currentTarget.innerHTML = 'B';
        remainMins--;
        gameStateArray[rIdx][cIdx] = 'Bomb';
        document.getElementById(`${rIdx}-${cIdx}`).removeEventListener('click', itemClickHandler);
    } else if(event.currentTarget.innerHTML === 'B') {
        event.currentTarget.innerHTML = '';
        remainMins++;
        gameStateArray[rIdx][cIdx] = false;
        document.getElementById(`${rIdx}-${cIdx}`).addEventListener('click', itemClickHandler);
    }
    
    updateMinesNumberUi();
    // console.log(remainMins);
    // console.log('bad az right click shodan');
    // console.log(gameStateArray);
};

for(const item of boardItems) {
    item.addEventListener('click', itemClickHandler);
    item.addEventListener('contextmenu', itemRightClickHandler);
}
