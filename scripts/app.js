const rowNumber = 10;
const colNumber = 15;
const minesNumber =20;

const gameArray = new Array(rowNumber).fill(0).map(() => new Array(colNumber).fill(0));

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
            j++
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
                    if(!((k >= 0 && k < gameArrayLength) && (l >= 0 && l < gameColLength))) {  // k and l if not in range of board should code conitue
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

//  Add event listener on board item
const boardItems = document.querySelectorAll('.game-board  div');

const gameOver = () => {
    for(const item of boardItems) {
        let itemIndexArray = item.id.split('-');
        item.textContent = gameArray[itemIndexArray[0]][itemIndexArray[1]];
    }
};

const emptyZeroElement = (rowIdx, colIdx) => {
    console.log('this is empty');
    console.log(rowIdx);
    console.log(colIdx);
    // for(let i = rowIdx - 1; i <= rowIdx + 1; i++) {
    //     for(let j = colIdx -1; j <= colIdx + 1; j++) {
    //         if(gameArray[i][j] !== '0') {
    //             continue;
    //         }
    //         if(gameArray[i][j] === '0') {
    //             console.log('run');
    //             // document.getElementById(`${i}-${j}`) = '0';
    //         }
    //     }
    // }
};

for(const item of boardItems) {
    let itemIndexArray = item.id.split('-');
    item.addEventListener('click', () => {
        item.textContent = gameArray[itemIndexArray[0]][itemIndexArray[1]];
        let itemContent = item.textContent;
        if(itemContent === 'x') {
            gameOver();
            item.style.color = 'red';
            item.style.backgroundColor = 'orange';
            item.style.fontSize = '20px';
            item.style.fontWeight = 'bolder';
        } else if(itemContent === '0') {
            emptyZeroElement(itemIndexArray[0], itemIndexArray[1]);
        }
        
    });
}
