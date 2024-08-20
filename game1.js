//board
let board;
let boardWidth = 1500;
let boardHeight = 700;
let context;

//players
let playerWidth = 80; 
let playerHeight = 10;
let playerVelocityX = 20;

let player = {
    x: boardWidth / 2 - playerWidth / 2,
    y: boardHeight - playerHeight - 5,
    width: playerWidth,
    height: playerHeight,
    velocityX: playerVelocityX
};

//balls
let balls = [];
let initialBall = {
    x: boardWidth / 2,
    y: boardHeight / 2,
    radius: 5,
    width: 10,
    height: 10,
    velocityX: 6, 
    velocityY: 5 
};
balls.push({ ...initialBall });

//blocks
let blockArray = [];
let blockWidth = 50;
let blockHeight = 10;
let blockColumns = 25;
let blockRows = 3; 
let blockMaxRows = 10; 
let blockCount = 0;
let currentLevel = 1;

//starting block corners top left 
let blockX = 15;
let blockY = 45;

let score = 0;
let gameOver = false;

//powerup
let powerup = {
    active: false,
    x: 0,
    y: 0,
    width: 20,
    height: 20,
    type: "addBall"
};
let powerupMessage = "";
let powerupActivationCount = 0;

window.onload = function () {
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext("2d");
        context.fillStyle = "skyblue";
    context.fillRect(player.x, player.y, player.width, player.height);

    requestAnimationFrame(update);
    document.addEventListener("keydown", movePlayer);

    //create blocks
    createBlocks();
};

function update() {
    requestAnimationFrame(update);
    if (gameOver) {
        return;
    }
    context.clearRect(0, 0, board.width, board.height);

    // player
    context.fillStyle = "lightgreen";
    context.fillRect(player.x, player.y, player.width, player.height);

    // balls
    balls.forEach(ball => {
        context.fillStyle = "white";
        context.beginPath();
        context.arc(ball.x, ball.y, ball.radius, 0, 2 * Math.PI);
        ball.x += ball.velocityX;
        ball.y += ball.velocityY;
        context.fill();

               if (ball.x <= 0 || ball.x >= boardWidth - ball.width) {
            ball.velocityX *= -1;
        }

        
        if (ball.y <= 0) {
            ball.velocityY *= -1;
        }
    });

        balls.forEach(ball => {
        if (topCollision(ball, player) || bottomCollision(ball, player)) {
            ball.velocityY *= -1;  
        } else if (leftCollision(ball, player) || rightCollision(ball, player)) {
            ball.velocityX *= -1;  
        }
    });

    // Remove balls that hit the bottom of the canvas
    balls = balls.filter(ball => ball.y + ball.height < boardHeight);

    if (balls.length === 0) {
        // If no balls left, game over
        context.font = "20px sans-serif";
        context.fillText("Game Over: Press 'Space' to Restart", 80, 400);
        gameOver = true;
    }

       context.fillStyle = "skyblue";
    for (let i = 0; i < blockArray.length; i++) {
        let block = blockArray[i];
        if (!block.break) {
            handleBlockCollision(block);
            context.fillStyle = getColorForBlock(block);
            context.fillRect(block.x, block.y, block.width, block.height);
        }
    }

        if (powerup.active) {
        context.fillStyle = "yellow";
        context.fillRect(powerup.x, powerup.y, powerup.width, powerup.height);
        context.fillStyle = "white";
        context.font = "20px sans-serif";
        context.textAlign = "center";
        context.fillText(powerupMessage, boardWidth / 2, boardHeight / 2);
        setTimeout(() => {
            powerup.active = false;
        }, 2000); 
    }

    //score
    context.font = "20px sans-serif";
    context.fillText(score, 10, 25);
}

function getColorForBlock(block) {
    if (block.type === "normal") {
        return "skyblue";
    } else if (block.type === "orange") {
        return "orange"; 
    }
}

function handleBlockCollision(block) {
    balls.forEach(ball => {
        if (detectCollision(ball, block)) {
            block.break = true;
            score += 100;
            blockCount--;
            if (!powerup.active) {
                spawnPowerup(block.x + block.width / 2, block.y + block.height / 2);
                powerupMessage = "Powerup Activated!";
                activatePowerup();
            }
                       if (topCollision(ball, block) || bottomCollision(ball, block)) {
                ball.velocityY *= -1;
            } else if (leftCollision(ball, block) || rightCollision(ball, block)) {
                ball.velocityX *= -1;
            }
        }
    });
}

function spawnPowerup(x, y) {
    powerup.x = x - powerup.width / 2;
    powerup.y = y - powerup.height / 2;
    powerup.active = true;
}

function activatePowerup() {
    if (powerupActivationCount < 3) { 
        // Add new ball to the balls array
        let newBall = {
            x: boardWidth / 2,
            y: boardHeight / 2,
            radius: 5,
            width: 10,
            height: 10,
            velocityX: -6, 
            velocityY: -5
        };
        balls.push(newBall);
        powerupActivationCount++;
    }
}

function createBlocks() {
    blockArray = [];

    // Create normal blocks for the first level
    if (currentLevel === 1) {
        let powerupIndexes = [];
        while (powerupIndexes.length < 3) {
            let powerupIndex = Math.floor(Math.random() * blockColumns * blockRows);
            if (!powerupIndexes.includes(powerupIndex)) {
                powerupIndexes.push(powerupIndex);
            }
        }

        let index = 0;
        for (let r = 0; r < blockRows; r++) {
            for (let c = 0; c < blockColumns; c++) {
                let block = {
                    x: blockX + c * blockWidth + c * 10,
                    y: blockY + r * blockHeight + r * 10,
                    width: blockWidth,
                    height: blockHeight,
                    type: "normal",
                    break: false
                };
                if (powerupIndexes.includes(index)) {
                    block.type = "orange"; // Set the block as powerup block
                }
                blockArray.push(block);
                index++;
            }
        }
    } else {
        // Create orange blocks for subsequent levels
        for (let c = 0; c < blockColumns; c++) {
            for (let r = 0; r < blockRows; r++) {
                let block = {
                    x: blockX + c * blockWidth + c * 10,
                    y: blockY + r * blockHeight + r * 10,
                    width: blockWidth,
                    height: blockHeight,
                    type: "orange",
                    break: false,
                    hitcount: 0
                };
                blockArray.push(block);
            }
        }
    }

    blockCount = blockArray.length;
}

function showMessage(message) {
    context.fillStyle = "white";
    context.font = "30px sans-serif";
    context.fillText(message, boardWidth / 2 - 100, boardHeight / 2);
}

function outOfBounds(xPosition) {
    return (xPosition < 0 || xPosition + playerWidth > boardWidth);
}

function movePlayer(e) {
    if (gameOver) {
        if (e.code === "Space") {
            resetGame();
            console.log("RESET");
        }
        return;
    }
    if (e.key === 'A' || e.key === 'a' || e.code === 'KeyA') {
        let nextplayerX = player.x - player.velocityX;
        if (!outOfBounds(nextplayerX)) {
            player.x = nextplayerX;
        }
    } else if (e.key === 'D' || e.key === 'd' || e.code === 'KeyD') {
        let nextplayerX = player.x + player.velocityX;
        if (!outOfBounds(nextplayerX)) {
            player.x = nextplayerX;
        }
    }
}

function detectCollision(a, b) {
    return a.x < b.x + b.width &&
        a.x + a.width > b.x &&
        a.y < b.y + b.height &&
        a.y + a.height > b.y;
}

function topCollision(ball, block) {
    return detectCollision(ball, block) && (ball.y + ball.radius) >= block.y;
}

function bottomCollision(ball, block) {
    return detectCollision(ball, block) && (block.y + block.height) >= ball.y - ball.radius;
}

function leftCollision(ball, block) {
    return detectCollision(ball, block) && (ball.x + ball.width) >= block.x;
}

function rightCollision(ball, block) {
    return detectCollision(ball, block) && (block.x + block.width) >= ball.x - ball.radius;
}

function resetGame() {
    gameOver = false;
    player = {
        x: boardWidth / 2 - playerWidth / 2,
        y: boardHeight - playerHeight - 5,
        width: playerWidth,
        height: playerHeight,
        velocityX: playerVelocityX
    };
    balls = [];
    balls.push({ ...initialBall });
    blockArray = [];
    blockRows = 3;
    score = 0;
    powerupActivationCount = 0;
    createBlocks();
}
