
const player = document.getElementById("player");
const game = document.querySelector(".game");
const scoreDisplay = document.getElementById("score");
const gameOverScreen = document.getElementById("game-over");
const startScreen = document.getElementById("start-screen");
const finalScore = document.getElementById("final-score");
const newBestScoreMessage = document.getElementById("new-best-score-message");

let foodCount = 0;
let bestScore = 0;
let level = 1;
let scrollSpeed = 3;
let spawnInterval;
let isGameOver = false;

const foodIcons = ["assets/food1.png", "assets/food2.png", "assets/food3.png", "assets/food4.png", "assets/food5.png"];
const boomIcon = "assets/Bomb.png";
const foodSound = new Audio("assets/eat.mp3");
const boomSound = new Audio("assets/blast.mp3");
const levelUpSound = new Audio("assets/levelpass.mp3");

let lastFoodSoundTime = 0; 


function updateScoreDisplay() {
    scoreDisplay.textContent = `Food: ${foodCount} | Best: ${bestScore} | Level: ${level}`;
}


function handleMove(event) {
    const gameBounds = game.getBoundingClientRect();
    let x = (event.touches ? event.touches[0].clientX : event.clientX) - gameBounds.left - player.offsetWidth / 2;
    x = Math.max(0, Math.min(x, gameBounds.width - player.offsetWidth));
    player.style.left = `${x}px`;
}
game.addEventListener("mousemove", handleMove);
game.addEventListener("touchmove", handleMove);


function spawnObject() {
    if (isGameOver) return;

   
    const isFood = Math.random() < 0.8; 
    const obj = document.createElement("div");
    obj.classList.add(isFood ? "food" : "boom");
    obj.style.left = `${Math.random() * (game.offsetWidth - 30)}px`;
    obj.style.animationDuration = `${scrollSpeed}s`;
    obj.style.backgroundImage = `url(${isFood ? foodIcons[(level - 1) % foodIcons.length] : boomIcon})`; // Change food icon based on level
    game.appendChild(obj);
    obj.addEventListener("animationend", () => obj.remove());
    checkCollision(obj, isFood);
}


function checkCollision(obj, isFood) {
    const checkInterval = setInterval(() => {
        const objBounds = obj.getBoundingClientRect();
        const playerBounds = player.getBoundingClientRect();

        if (
            objBounds.left < playerBounds.right &&
            objBounds.right > playerBounds.left &&
            objBounds.top < playerBounds.bottom &&
            objBounds.bottom > playerBounds.top
        ) {
            obj.remove();
            clearInterval(checkInterval);
            if (isFood) {
                foodCount++;
                const now = Date.now();
                if (now - lastFoodSoundTime > 200) {
                    foodSound.play();
                    lastFoodSoundTime = now;
                }
                updateScoreDisplay();
                checkLevelUp();
            } else if (!isGameOver) {
                boomSound.play();
                endGame();
            }
        }
    }, 100);
}


function checkLevelUp() {
    if (foodCount > 0 && foodCount % 10 === 0) {
        level++;
        scrollSpeed = Math.max(1, scrollSpeed - 0.3);
        levelUpSound.play();
        clearInterval(spawnInterval);
        spawnInterval = setInterval(spawnObject, Math.max(500, 1000 - level * 50));
        showLevelLine();
        updateScoreDisplay();
    }
}


function showLevelLine() {
    const levelLine = document.createElement("div");
    levelLine.classList.add("level-line");
    game.appendChild(levelLine);
    setTimeout(() => levelLine.remove(), 1000);
}


function startGame() {
    isGameOver = false;
    foodCount = 0;
    level = 1;
    scrollSpeed = 3;
    updateScoreDisplay();
    gameOverScreen.classList.add("hidden");
    startScreen.classList.add("hidden");
    game.classList.remove("hidden");
    spawnInterval = setInterval(spawnObject, 1000);
}


function endGame() {
    if (isGameOver) return;
    isGameOver = true;
    clearInterval(spawnInterval);
    finalScore.textContent = foodCount;

    if (foodCount > bestScore) {
        bestScore = foodCount;
        newBestScoreMessage.textContent = `Congratulations! New Best Score: ${bestScore}`; 
        newBestScoreMessage.classList.remove("hidden"); 
    } else {
        newBestScoreMessage.classList.add("hidden"); 
    }
    gameOverScreen.classList.remove("hidden");
    document.querySelectorAll(".food, .boom").forEach(obj => obj.remove());
}


function restartGame() {
    gameOverScreen.classList.add("hidden");
    startGame();
}
