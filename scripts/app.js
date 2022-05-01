import { RNumber, CNumber, MNumber } from './gamePlay.js';

const rowNumber = RNumber;
const colNumber = CNumber;
const minesNumber = MNumber;
let remainMins = minesNumber;

export const runGame = () => {
    
    const boardContainer = document.querySelector('.game-board');
    document.querySelector('.mins-number p').innerHTML = remainMins;
    
    // this function is for adjust number of columns Board
    const setColNumberInUi = () => {
        let valueForCss = '';
        for(let i = 0; i < colNumber; i++) {
            valueForCss += 'auto ';
        }
        boardContainer.style['grid-template-columns'] = valueForCss;
    }
    
    //  emoji element for winning or lossing the user and function for updated it in UI
    const winStatusEmoji = document.querySelector('.retry-game span');
    
    const updateWinStatusEmoji = (status) => {
        switch (status) {
            case 'win':
                winStatusEmoji.innerHTML = '&#128526;';
                break;
            case 'lose':
                winStatusEmoji.innerHTML = '&#128547;';
                break;
        }
    };
    
    // Helper function for log array in console of Web browser
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
    
    
    const gameArray = new Array(rowNumber).fill(0).map(() => new Array(colNumber).fill(0));
    const gameStateArray = new Array(rowNumber).fill(false).map(() => new Array(colNumber).fill(false));
    
    let gameArrayLength = gameArray.length;
    let gameColLength = gameArray[0].length;
    
    console.log(gameArray);
    // console.log(gameStateArray);
    
    // This function for show game board in UI side
    const createBoardUI = () => {
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
        setColNumberInUi();
    };
    
    // random number between 0 and number input, that it is exclude
    const randomIndexUpToNumber = (num) => {
        return Math.floor(Math.random() * num);
    };
    
    //  create array for pick mines in location of created in below
    let existLocation = [];
    
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
    
    
    //  ----- WORK ON Show initialize UI finish -------
    
    
    // Note that this const(boardItem) when The createBoardUi function finished is available 
    const boardItems = document.querySelectorAll('.game-board  div');
    
    // disable the right click on the game-board container for handle right click on board items
    document.querySelector('.game-board').addEventListener('contextmenu', event => {
        event.preventDefault();
    });
    
    const setColorNumber = (rowItemIndex, colItemIndex, itemContent) => {
        let rIdx = +rowItemIndex;
        let cIdx = +colItemIndex;
        switch (itemContent) {
            case 1:
                document.getElementById(`${rIdx}-${cIdx}`).classList.add('blue');
                break;
            case 2:
                document.getElementById(`${rIdx}-${cIdx}`).classList.add('green');
                break;
            case 3:
                document.getElementById(`${rIdx}-${cIdx}`).classList.add('red');
                break;
            case 4:
                document.getElementById(`${rIdx}-${cIdx}`).classList.add('purple');
                break;
            case 5:
                document.getElementById(`${rIdx}-${cIdx}`).classList.add('brown');
                break;
            case 6:
                document.getElementById(`${rIdx}-${cIdx}`).classList.add('orange');
                break;
            case 7:
                document.getElementById(`${rIdx}-${cIdx}`).classList.add('yellow');
                break;
            case 8:
                document.getElementById(`${rIdx}-${cIdx}`).classList.add('black');
                break;
            default:
                break;
        }
    };
    
    const disableClickAndContextmenu = (row, col) => {
        document.getElementById(`${row}-${col}`).removeEventListener('click', itemClickHandler);
        document.getElementById(`${row}-${col}`).removeEventListener('contextmenu', itemRightClickHandler);
    };
    
    const updateMinesNumberUi = () => {
        const remainsMinsHeader = document.querySelector('.mins-number p');
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
                item.innerHTML = '<i class="fa fa-bomb"></i>';
            }
            if(item.innerHTML === '<i class="fa fa-flag-checkered"></i>') {
                item.style.backgroundColor = '#ffa0a0';
            }
        }
        updateWinStatusEmoji('lose');
    };
    
    const emptyZeroElement = (rowIdx, colIdx) => {
        //  arguments is string and we have to change them to number
        let rIdx = +rowIdx;
        let cIdx = +colIdx;
        gameArray[rIdx][cIdx] = 'r';
        
        gameStateArray[rIdx][cIdx] = true;   //  Update gameStateArray
        if(document.getElementById(`${rIdx}-${cIdx}`).innerHTML === '<i class="fa fa-flag-checkered"></i>') {
            remainMins++;
            updateMinesNumberUi();
        }
        disableClickAndContextmenu(rIdx, cIdx);
        
        for(let i = rIdx - 1; i <= rIdx + 1; i++) {
            for(let j = cIdx -1; j <= cIdx + 1; j++) {
                if(!((i >= 0 && i < gameArrayLength) && (j >= 0 && j < gameColLength))) {   //  for reliza that item is exist in between arrayLength and arrayColLength
                    continue;
                }
                if(gameArray[i][j] > 0) {   //  if element is number grater than zero, show number to user and continue after steps
                    if(document.getElementById(`${i}-${j}`).innerHTML === '<i class="fa fa-flag-checkered"></i>') {
                        remainMins++;
                        updateMinesNumberUi();
                    }
                    setColorNumber(i, j, gameArray[i][j]);
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
        let correctLocatedMins = true;
        // console.log(gameStateArray);
    
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
                        document.getElementById(`${i}-${j}`).innerHTML = 
                            '<i class="fa fa-flag-checkered" style="color: #024E02;"></i>';
                    }
                    j++;
                }
                i++;
            }
            // console.log(gameStateArray);
    
            remainMins = 0;
            updateMinesNumberUi();
            updateWinStatusEmoji('win');
        }
    };
    
    const itemClickHandler = event => {
        // console.log('clicked');
        let itemIndexArray = event.currentTarget.id.split('-');
        let rIdx = itemIndexArray[0];
        let cIdx = itemIndexArray[1];
        let itemContent = gameArray[rIdx][cIdx];
        event.currentTarget.textContent = itemContent;
    
        if(itemContent === 'x') {
            gameOver(event.currentTarget);
        } else if(itemContent === 0) {
            emptyZeroElement(rIdx, cIdx);
            diagnoseWinningUser();
        } else if(itemContent > 0) {
            gameStateArray[rIdx][cIdx] = true;
            disableClickAndContextmenu(rIdx, cIdx);
            setColorNumber(rIdx, cIdx, itemContent);
            diagnoseWinningUser();
        }
        
        // logger(gameArray);
        // console.log(gameStateArray);
    };
    
    const itemRightClickHandler = event => {
        // console.log('right click');
        
        let itemIndexArray = event.currentTarget.id.split('-');
        let rIdx = itemIndexArray[0];
        let cIdx = itemIndexArray[1];
        let itemContent = gameArray[itemIndexArray[0]][itemIndexArray[1]];  // itemContent show reality of this item, that is exist on gameArray
    
        if(event.currentTarget.innerHTML === '' && remainMins > 0) {
            event.currentTarget.innerHTML = '<i class="fa fa-flag-checkered"></i>';
            remainMins--;
            gameStateArray[rIdx][cIdx] = 'Bomb';
            document.getElementById(`${rIdx}-${cIdx}`).removeEventListener('click', itemClickHandler);
        } else if(event.currentTarget.innerHTML === '<i class="fa fa-flag-checkered"></i>') {
            event.currentTarget.innerHTML = '';
            remainMins++;
            gameStateArray[rIdx][cIdx] = false;
            document.getElementById(`${rIdx}-${cIdx}`).addEventListener('click', itemClickHandler);
        }
        
        updateMinesNumberUi();
        // console.log(gameArray);
        // console.log(gameStateArray);
    };
    
    for(const item of boardItems) {
        item.addEventListener('click', itemClickHandler);
        item.addEventListener('contextmenu', itemRightClickHandler);
    }
}
