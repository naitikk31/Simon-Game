let gameSeq = [];
let userSeq = [];

let btns = ['yellow', 'red', 'purple', 'green'];

let level = 0;
let started = false;
let acceptingInput = false;

let highScore = localStorage.getItem("highScore") || 0;

let startButton = document.querySelector(".start");
let h3 = document.querySelector("h3");
let allBtns = document.querySelectorAll(".btn");

/* ---------- START GAME ---------- */
h3.innerText = `Press Start to Play | High Score: ${highScore}`;

startButton.addEventListener("click", () => {
    if (!started) {
        started = true;
        startButton.style.display = "none";
        levelUp();
    }
});

/* ---------- FLASH FUNCTIONS ---------- */
function gameFlash(btn){
    playGameTap();

    // 🔑 Reset animation if same button repeats
    btn.classList.remove("flash");
    void btn.offsetWidth; // force browser reflow

    btn.classList.add("flash");
    setTimeout(() => {
        btn.classList.remove("flash");
    }, 300);
}


function userFlash(btn) {
    btn.classList.add("userflash");
    setTimeout(() => btn.classList.remove("userflash"), 250);
}

/* ---------- LEVEL UP ---------- */
function levelUp() {
    userSeq = [];
    level++;

    h3.innerText = `Level ${level} | High Score: ${highScore}`;
    playLevelUp();

    let randIdx = Math.floor(Math.random() * btns.length);
    let randColor = btns[randIdx];
    gameSeq.push(randColor);

    acceptingInput = false;
    disableButtons();

    setTimeout(playSequence, 600);
}

/* ---------- PLAY SEQUENCE ---------- */
function playSequence() {
    let i = 0;

    let speed = Math.max(300, 700 - level * 40);

    let interval = setInterval(() => {
        let color = gameSeq[i];
        let btn = document.querySelector(`.${color}`);
        gameFlash(btn);
        i++;

        if (i === gameSeq.length) {
            clearInterval(interval);
            setTimeout(() => {
                acceptingInput = true;
                enableButtons();
            }, 200);
        }
    }, speed);
}

/* ---------- CHECK ANSWER ---------- */
function checkAns(idx) {
    if (userSeq[idx] === gameSeq[idx]) {
        if (userSeq.length === gameSeq.length) {
            setTimeout(levelUp, 1000);
        }
    } else {
        gameOver();
    }
}

/* ---------- BUTTON PRESS ---------- */
function btnPress() {
    if (!started || !acceptingInput) return;

    let btn = this;
    let userColor = btn.getAttribute("id");

    userFlash(btn);
    playUserTap();

    userSeq.push(userColor);
    checkAns(userSeq.length - 1);
}

for (let btn of allBtns) {
    btn.addEventListener("click", btnPress);
}

/* ---------- GAME OVER ---------- */
function gameOver() {
    if (level > highScore) {
        highScore = level;
        localStorage.setItem("highScore", highScore);
    }

    h3.innerHTML = `
        Game Over!<br>
        Score: <b>${level}</b><br>
        High Score: <b>${highScore}</b><br>
        Press Restart to Play Again
    `;

    document.body.style.backgroundColor = "red";
    setTimeout(() => document.body.style.backgroundColor = "white", 200);

    reset();
}

/* ---------- RESET ---------- */
function reset() {
    started = false;
    acceptingInput = false;
    level = 0;
    gameSeq = [];
    userSeq = [];

    startButton.innerText = "Restart";
    startButton.style.display = "inline";

    disableButtons();
}

/* ---------- ENABLE / DISABLE BUTTONS ---------- */
function disableButtons() {
    allBtns.forEach(btn => btn.classList.add("disabled"));
}

function enableButtons() {
    allBtns.forEach(btn => btn.classList.remove("disabled"));
}

/* ---------- SOUND FUNCTIONS ---------- */
function playGameTap() {
    new Audio("Sound/gametap.wav").play();
}

function playUserTap() {
    new Audio("Sound/tap.wav").play();
}

function playLevelUp() {
    new Audio("Sound/levelup.mp3").play();
}
