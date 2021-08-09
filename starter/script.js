'use strict';

const score0El = document.querySelector('#score--0');
const score1El = document.querySelector('#score--1');

const current0El = document.getElementById('current--0');
const current1El = document.getElementById('current--1');

const diceEl = document.querySelector('.dice');
const btnRole = document.querySelector('.btn--roll');
const btnNew = document.querySelector('.btn--new');
const btnHold = document.querySelector('.btn--hold');

let currentScore = 0;
let turn = 0;
let playing = true;

const init = function () {
    document.querySelector(`.player--${turn}`).classList.remove('player--winner');
    currentScore = 0;
    turn = 0;
    playing = true;
    score0El.textContent = 0;
    score1El.textContent = 0;
    diceEl.classList.add('hidden');
}
init();

const activate = function (player) {
    document.querySelector(`.${player}`).classList.add('player--active')
}
const deactivate = function (player) {
    document.querySelector(`.${player}`).classList.remove('player--active')
}
const changeTurn = function () {
    if (turn) {
        score1El.textContent = Number(score1El.textContent) + currentScore;
        if (isWinner(score1El.textContent)) return;
        turn = 0;
        current1El.textContent = 0;
        activate('player--0');
        deactivate('player--1');
    } else {
        score0El.textContent = Number(score0El.textContent) + currentScore;
        if (isWinner(score0El.textContent)) return;
        turn = 1;
        current0El.textContent = 0;
        activate('player--1');
        deactivate('player--0');
    }
    currentScore = 0;
}

const isWinner = function (scores) {
    if (Number(scores) >= 100) {
        document.querySelector(`.player--${turn}`).classList.add('player--winner');
        diceEl.classList.add('hidden');
        playing = false;
        return true;
    }
}

const addRole = btnRole.addEventListener('click', function () {
    if (playing) {
        let dice = Math.trunc(Math.random() * 6) + 1;

        diceEl.src = `dice-${dice}.png`;
        diceEl.classList.remove('hidden');

        if (dice !== 1) {
            currentScore += dice;
            turn ? current1El.textContent = currentScore : current0El.textContent = currentScore;
        } else {
            currentScore = 0;
            changeTurn();
        }
    }
});


const addHold = btnHold.addEventListener('click', function () {
    if (playing) {
        changeTurn()
    }
});
btnNew.addEventListener('click', init)
