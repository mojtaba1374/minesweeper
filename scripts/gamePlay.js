// Game play and pick level with User

export let RNumber;
export let CNumber;
export let MNumber;

const rowSlider = document.querySelector('#row-range');
const rowOutput = document.querySelector('.row-bar-container span');
const colSlider = document.querySelector('#col-range');
const colOutput = document.querySelector('.col-bar-container span');
const minSlider = document.querySelector('#min-range');
const minOutput = document.querySelector('.min-bar-container span');
const startGameBtn = document.querySelector('.start-game-btn');
const container = document.querySelector('.container');

rowSlider.addEventListener('input', event => {
    rowOutput.innerHTML = event.target.value;
});

colSlider.addEventListener('input', event => {
    colOutput.innerHTML = event.target.value;
});

minSlider.addEventListener('input', event => {
    minOutput.innerHTML = event.target.value;
});

const startGameBtnClickHandler = () => {
    RNumber = +rowSlider.value;
    CNumber = +colSlider.value;
    MNumber = +minSlider.value;
    container.innerHTML = `
    <div class="app">
        <div class="game-header">
            <div class="mins-number">
                <p></p>
            </div>
            <div class="retry-game">
                <p>
                    <span>&#x1F60A;</span>
                </p>
            </div>
            <div class="time-passed">
                <p>0</p>
            </div>
        </div>
        <div class="game-board">

        </div>
    </div>
    `;
    import('./app.js')
        .then(module => {
            module.runGame();
        })
        .catch(err => {
            console.log(err);
        });
}

startGameBtn.addEventListener('click', startGameBtnClickHandler);
