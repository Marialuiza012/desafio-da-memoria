
const emojis = ["🐱", "🐶", "🦋", "🌸", "🍓", "🧁", "🐰", "💜"];

let cards = [...emojis, ...emojis];
let firstCard = null;
let secondCard = null;
let lockBoard = false;
let moves = 0;
let matchedPairs = 0;
let seconds = 0;
let timerInterval = null;
let started = false;

const board = document.getElementById("game-board");
const movesDisplay = document.getElementById("moves");
const timerDisplay = document.getElementById("timer");
const message = document.getElementById("message");

function startTimer() {
    if (started) return;

    started = true;

    timerInterval = setInterval(() => {
        seconds++;

        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;

        timerDisplay.textContent =
            String(minutes).padStart(2, "0") + ":" +
            String(remainingSeconds).padStart(2, "0");
    }, 1000);
}

function createBoard() {
    board.innerHTML = "";

    cards.sort(() => Math.random() - 0.5);

    cards.forEach((emoji) => {
        const card = document.createElement("button");

        card.classList.add("card");
        card.textContent = "❔";
        card.dataset.emoji = emoji;
        card.setAttribute("aria-label", "Carta escondida");

        card.addEventListener("click", () => flipCard(card));

        board.appendChild(card);
    });
}

function flipCard(card) {
    if (
        lockBoard ||
        card.classList.contains("flipped") ||
        card.classList.contains("matched")
    ) return;

    startTimer();

    card.textContent = card.dataset.emoji;
    card.classList.add("flipped");
    card.setAttribute("aria-label", card.dataset.emoji);

    if (!firstCard) {
        firstCard = card;
        return;
    }

    secondCard = card;
    moves++;

    movesDisplay.textContent = moves;

    checkMatch();
}

function checkMatch() {
    if (firstCard.dataset.emoji === secondCard.dataset.emoji) {
        firstCard.classList.add("matched");
        secondCard.classList.add("matched");

        matchedPairs++;

        resetTurn();

        if (matchedPairs === emojis.length) {
            clearInterval(timerInterval);
            message.textContent =
                "🎉 Parabéns! Você encontrou todos os pares!";
        }
    } else {
        lockBoard = true;

        setTimeout(() => {
            firstCard.textContent = "❔";
            secondCard.textContent = "❔";

            firstCard.classList.remove("flipped");
            secondCard.classList.remove("flipped");

            firstCard.setAttribute("aria-label", "Carta escondida");
            secondCard.setAttribute("aria-label", "Carta escondida");

            resetTurn();
        }, 1000);
    }
}

function resetTurn() {
    firstCard = null;
    secondCard = null;
    lockBoard = false;
}

function restartGame() {
    clearInterval(timerInterval);

    firstCard = null;
    secondCard = null;
    lockBoard = false;
    moves = 0;
    matchedPairs = 0;
    seconds = 0;
    started = false;
    timerInterval = null;

    movesDisplay.textContent = "0";
    timerDisplay.textContent = "00:00";
    message.textContent = "";

    createBoard();
}

document.getElementById("restart")
    .addEventListener("click", restartGame);

createBoard();

