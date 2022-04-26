const rowNumber = 7;
const colNumber = 10;
const minesNumber =10;
let remainMins = minesNumber;

document.querySelector('.mins-number').innerHTML = minesNumber;

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

const gameItemState = new Array(rowNumber).fill(false).map(() => new Array(colNumber).fill(false));
console.log(gameItemState);

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

//  create array for pick mine in location of created in below
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
    let rndIndex = randomIndexUpToNumber(existLocation.length - 1);
    let rowGameArray = existLocation[rndIndex][0];
    let colGameArray = existLocation[rndIndex][1];
    existLocation.splice(rndIndex, 1);
    gameArray[rowGameArray][colGameArray] = 'x';
}

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
}

const initializeBoard = () => {
    createBoardUI();
    createExistLocationArr();
    for(let i = 0; i < minesNumber; i++) {
        locatedMinesInGameArray();
    }
    setNumberSurroundOfMines();
};

initializeBoard();

//  ----- WORK ON UI -------

//  Add event listener on board item
const boardItems = document.querySelectorAll('.game-board  div');

const gameOver = (itm) => {
    itm.style.color = 'red';
    itm.style.backgroundColor = 'orange';
    itm.style.fontSize = '20px';
    itm.style.fontWeight = 'bolder';
    for(const item of boardItems) {
        item.classList.add('reset-color-items');
        let itemIndexArray = item.id.split('-');
        item.textContent = gameArray[itemIndexArray[0]][itemIndexArray[1]];
        item.removeEventListener('click', itemClickHandler); // delete event listener from all elements when user clicked on any mines
    }
};

const emptyZeroElement = (rowIdx, colIdx) => {
    // arguments is string and we have to change them to number
    let rIdx = +rowIdx;
    let cIdx = +colIdx;
    gameArray[rIdx][cIdx] = 'r';
    
    for(let i = rIdx - 1; i <= rIdx + 1; i++) {
        for(let j = cIdx -1; j <= cIdx + 1; j++) {
            if(!((i >= 0 && i < gameArrayLength) && (j >= 0 && j < gameColLength))) {
                continue;
            }
            //  this if condition meant, if element is number grater than zero, show number to user and continue after steps 
            if(gameArray[i][j] > 0) {
                document.getElementById(`${i}-${j}`).textContent = gameArray[i][j];
                document.getElementById(`${i}-${j}`).removeEventListener('click', itemClickHandler);
                document.getElementById(`${i}-${j}`).removeEventListener('contextmenu', itemRightClickHandler);
                continue;
            }
            if(gameArray[i][j] === 'r') {
                document.getElementById(`${i}-${j}`).textContent = '';
                document.getElementById(`${i}-${j}`).classList.add('game-board-empty-item');
                document.getElementById(`${i}-${j}`).removeEventListener('click', itemClickHandler);
                document.getElementById(`${i}-${j}`).removeEventListener('contextmenu', itemRightClickHandler);
                continue;
            }
            if(document.getElementById(`${i}-${j}`).innerHTML === '<i class="fa fa-flag"></i>') {
                remainMins++;
                updateMinesNumberUi();
            }
            if(gameArray[i][j] === 0) {
                document.getElementById(`${i}-${j}`).removeEventListener('click', itemClickHandler);
                document.getElementById(`${i}-${j}`).removeEventListener('contextmenu', itemRightClickHandler);
                emptyZeroElement(i, j);
            }
        }
    }
};

const logger = () => {
    let str = '';
    for (let i = 0; i < gameArray.length; i++) {
        str += '| ';
        for (let j = 0; j < gameArray[0].length; j++) {
            str += gameArray[i][j] + ' | ';
        }
        str += '\n';
    }
    return str;
};

const itemClickHandler = event => {
    console.log('clicked');
    let itemIndexArray = event.currentTarget.id.split('-');
    let itemContent = gameArray[itemIndexArray[0]][itemIndexArray[1]];
    event.currentTarget.textContent = itemContent;

    if(itemContent === 'x') {
        gameOver(event.currentTarget);
    } else if(itemContent === 0) {
        emptyZeroElement(itemIndexArray[0], itemIndexArray[1]);
    }
    
    console.log(logger());
};


// disable the right click on the page
window.addEventListener('contextmenu', event => {
    event.preventDefault();
});
 
const updateMinesNumberUi = () => {
    const remainsMinsHeader = document.querySelector('.mins-number');
    remainsMinsHeader.innerHTML = remainMins;
};


const itemRightClickHandler = event => {
    console.log('right click');
    let itemIndexArray = event.currentTarget.id.split('-');
    let itemContent = gameArray[itemIndexArray[0]][itemIndexArray[1]];  // itemContent show reality of this item

    if(event.currentTarget.innerHTML === '' && remainMins > 0) {
        console.log('1');
        event.currentTarget.innerHTML = '<i class="fa fa-flag"></i>';
        remainMins--;
    } else if(event.currentTarget.innerHTML === '<i class="fa fa-flag"></i>') {
        console.log('2');
        event.currentTarget.innerHTML = '';
        remainMins++;
    }
    
    console.log(remainMins);
    updateMinesNumberUi();
};

for(const item of boardItems) {
    item.addEventListener('click', itemClickHandler);
    item.addEventListener('contextmenu', itemRightClickHandler);
}
