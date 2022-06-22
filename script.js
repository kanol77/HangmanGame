const wordField = document.querySelector('.word');
const hangmanField = document.querySelector('.hangman');
const keyboardField = document.querySelector('.keyboard');
const wordLength = randomIntFromInterval(4, 10);
const stage1 = document.querySelector('.stage1');
const stage2 = document.querySelector('.stage2');
const stage3 = document.getElementsByClassName('stage3');
const stage3Part1 = stage3[0];
const stage3Part2 = stage3[1];
const stage4 = document.querySelector('.stage4');
const stage5 = document.querySelector('.stage5');
const stage6 = document.querySelector('.stage6');
const stage7 = document.getElementsByClassName('stage7');
const stage7Part1 = stage7[0];
const stage7Part2 = stage7[1];
const stage8 = document.querySelector('.stage8');
const stage9 = document.querySelector('.stage9');

let errors = 0;

const sfx = {
    snap: new Howl({
        src: "./snap.mp3"
    }),
    keyPress: new Howl({
        src: "./click.mp3"
    }),
    win: new Howl({
        src: "./win.mp3"
    })
}

const API_URL = "https://random-word-api.herokuapp.com/word?length=" + wordLength;

function randomIntFromInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function populateKeyboard() {
    let fragment = document.createDocumentFragment();

    for (let i = 1; i <= 26; i++) {
        let newDiv = document.createElement('div');
        newDiv.classList.add('key');
        let text = document.createElement('p');
        text.innerText = String.fromCharCode(64 + i);
        newDiv.appendChild(text);
        fragment.appendChild(newDiv);
    }
    keyboardField.appendChild(fragment);
}

async function fetchData() {
    try {
        const data = await fetch(API_URL);
        if (data.ok) {
            const reply = await data.json();
            const word = await reply[0].toUpperCase();
            showWord(word);
        }
        else console.error('API ERROR');
    }
    catch (error) {
        console.error('An API error has occured: ' + error);
    }
}

fetchData();
populateKeyboard();
checkIfClicked();
setInterval(checkWin, 1000);

let actualWord;

function showWord(word) {
    for (let i = 0; i < wordLength; i++) {
        let newParagraph = document.createElement('p');
        newParagraph.classList.add('letter' + i);
        newParagraph.innerText = word[i];
        wordField.appendChild(newParagraph);
        actualWord = word;
    }
}

function checkIfClicked() {
    let keyArr = document.getElementsByClassName('key');

    for (let i = 0; i < 26; i++) {
        keyArr[i].addEventListener('click', () => {
            sfx.keyPress.play();
            let flag = 1;
            for (let j = 0; j < wordLength; j++) {
                let letter = document.querySelector('.letter' + j);
                if (keyArr[i].innerText == letter.innerText) {
                    letter.style.color = 'white';
                    letter.classList.add('check');
                    flag = 0;
                }
            }
            if (flag == 1) {
                drawHangman();
                errors++;
            }
        })
    }
}

function drawHangman() {
    if (errors == 0) stage1.classList.add('shown');
    else if (errors == 1) stage2.classList.add('shown');
    else if (errors == 2) {
        stage3Part1.classList.add('shown');
        stage3Part2.classList.add('shown');
    }
    else if (errors == 3) stage4.classList.add('shown');
    else if (errors == 4) stage5.classList.add('shown');
    else if (errors == 5) stage6.classList.add('shown');
    else if (errors == 6) {
        stage7Part1.classList.add('shown');
        stage7Part2.classList.add('shown');
    }
    else if (errors == 7) stage8.classList.add('shown');
    else if (errors == 8) {
        stage9.classList.add('shown');
        setTimeout(sfx.snap.play(), 200);
        setTimeout(endBad, 500);
    }
}

function endBad() {
    alert('You Lost! The word was: ' + actualWord);
    window.location.reload();
}

function endGood() {
    alert('You Won! The word was: ' + actualWord);
    window.location.reload();
}

let shownLetters = 0;

function checkWin() {
    for (let j = 0; j < wordLength; j++) {
        let lett = document.querySelector('.letter' + j);
        if (lett.classList.contains('check')) shownLetters++;
    }
    if (shownLetters == wordLength) {
        sfx.win.play();
        setTimeout(endGood, 500);
    }
    else shownLetters = 0;
}