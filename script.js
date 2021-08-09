'use strict';

let range = 100;
let secretNumber = Math.trunc(Math.random() * range);
let score = range;
let highScore = 0;


document.querySelector('.check').addEventListener('click', function () {
    let guess = Number(document.querySelector('.guess').value);
    if (!guess) {
        document.querySelector('.message').textContent = 'לא בחרת';
    } else if (guess === secretNumber) {
        document.querySelector('.message').textContent = 'מעולה! ניצחת';
        document.querySelector('.number').textContent = secretNumber;
        document.querySelector('body').style.backgroundColor = '#60b347';
    } else {
        if (score > 1) {
            score--;
            if (guess > secretNumber) {
                document.querySelector('.message').textContent = 'המספר גבוה מידי';
            } else {
                document.querySelector('.message').textContent = 'המספר נמוך מידי';
            }
            document.querySelector('.score').textContent = score;
        } else {
            document.querySelector('.message').textContent = 'נגמרו הנסיונות';
        }
    }
});

document.querySelector('.again').addEventListener('click', function () {
    if (score > highScore) {
        highScore = score;
    }
    score = range;
    document.querySelector('.score').textContent = score;
    document.querySelector('.highscore').textContent = highScore;
    document.querySelector('.message').textContent = '...מתחיל לנחש';
    document.querySelector('body').style.backgroundColor = '#222';
    document.querySelector('.number').textContent = '?';
    document.querySelector('.guess').value = '';
    secretNumber = Math.trunc(Math.random() * range);
});