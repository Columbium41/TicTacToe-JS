// Game Variables
var p_scores = {
    "Easy": 0,
    "Normal": 0,
    "Hard": 0,
    "Impossible": 0
};
var cpu_scores = {
    "Easy": 0,
    "Normal": 0,
    "Hard": 0,
    "Impossible": 0
};
var inGame = false;
var playerTurn = false;
var grid = [
    ["", "", ""],  
    ["", "", ""],
    ["", "", ""]  
];
playerTile = "";
CPU_Tile = "";
CPU_Mode = "";

// HTML Objects
const menu = document.getElementById("menu");
const game = document.getElementById("game");
const menuButtons = document.getElementsByClassName("difficulty-button");
const grids = document.getElementsByTagName("td");
const info = document.getElementById("info");
const gameOverOverlay = document.getElementById("game-over-overlay");
const returnButton = document.getElementById("return-button");

// Add event listeners to buttons
for (var i = 0; i < menuButtons.length; i++) { // Menu Buttons
    menuButtons[i].addEventListener("click", e => {
        startGame(e.target.innerText);
    });
}
returnButton.addEventListener("click", e => { // Exit Button
    exitGame();
});

// Add event listeners and IDs to tic-tac-toe grids 
for (var i = 0; i < grids.length; i++) {
    row = Math.floor(i / 3);
    col = i % 3;
    grids[i].id = `${row},${col}`

    grids[i].addEventListener("click", e => {
        placeTile(e.target.id);
    });
}

// A function to start a game of tictactoe
function startGame(difficulty) {
    inGame = true;
    CPU_mode = difficulty;
    
    // Determine whether the player or cpu goes first
    if (Math.floor(Math.random() * 2) === 0) {
        playerTurn = true;
        playerTile = "X";
        CPU_Tile = "O";
    }
    else {
        playerTurn = false;
        playerTile = "O";
        CPU_Tile = "X";
    }

    // Set text for information labels
    info.children[0].textContent = `Player vs. ${difficulty} CPU`;
    info.children[1].textContent = `${((playerTurn) ? ("Player") : ("CPU"))} Turn`

    // Change interface from menu to game
    menu.style.display = "none";
    game.style.display = "block";

    if (!playerTurn) {
        CPUmove();
    }
}


function exitGame() {
    resetVariables();

    // Change interface from game to menu
    game.style.display = "none";
    menu.style.display = "flex";
}


function placeTile(location) {
    // Return nothing if location is invalid
    if (location === "") {
        return;
    }

    // Get the location of the tile the user wants to place
    split = location.split(",");
    r = split[0];
    c = split[1];

    // Check if a tile can be placed at the location
    if (inGame && playerTurn && grid[r][c] === "") {
        playerTurn = false;
        tile = document.getElementById(location);

        grid[r][c] = playerTile;
        tile.children[0].textContent = playerTile;
        info.children[1].textContent = `${((playerTurn) ? ("Player") : ("CPU"))} Turn`;
        checkGameStatus();

        // If the game is not over, let CPU move
        if (inGame) {
            CPUmove();
        }
    }
}


function CPUmove() {
    move = [Math.floor(Math.random() * 3), Math.floor(Math.random() * 3)];
    if (CPU_mode === "Easy") {  // Pick the worst possible moves with minimax
        move = EasyCPUMove();
    }
    else if (CPU_mode === "Normal") {  // Pick random moves
        while (grid[move[0]][move[1]] !== "") {
            move[0] = Math.floor(Math.random() * 3);
            move[1] = Math.floor(Math.random() * 3);
        }
    }
    else if (CPU_mode === "Hard") {  // Look for winning moves and block opponnent's 3 in a rows
        move = hardCPUMove();
    }
    else if (CPU_mode === "Impossible") {  // Use minimax
        move = minimaxHelper(!playerTurn);
    }

    playerTurn = true;
    tile = document.getElementById(`${move[0]},${move[1]}`)

    grid[move[0]][move[1]] = CPU_Tile;
    tile.children[0].textContent = CPU_Tile;
    info.children[1].textContent = `${((playerTurn) ? ("Player") : ("CPU"))} Turn`;
    checkGameStatus();
}


function checkGameStatus() {
    currentStatus = gameStatus();
    if (currentStatus !== "") {
        inGame = false;

        if (currentStatus === playerTile) {
            p_scores[CPU_mode]++; 
            alert(`Player won the game! The score is ${p_scores[CPU_mode]} - ${cpu_scores[CPU_mode]}`);
        }
        else if (currentStatus === CPU_Tile) {
            cpu_scores[CPU_mode]++;
            alert(`CPU won the game! The score is ${p_scores[CPU_mode]} - ${cpu_scores[CPU_mode]}`);
        }
        else {
            alert(`Game is tied! The score is ${p_scores[CPU_mode]} - ${cpu_scores[CPU_mode]}`);
        }
        gameOverOverlay.style.display = "block";
    }

}


function gameStatus() {
    // Check if either the player or CPU won
    symbols = [playerTile, CPU_Tile];
    for (var i = 0; i < symbols.length; i++) {
        symbol = symbols[i];

        horizontal = ((grid[0][0] === symbol && grid[0][1] === symbol && grid[0][2] === symbol) ||
                     (grid[1][0] === symbol && grid[1][1] === symbol && grid[1][2] === symbol) ||
                     (grid[2][0] === symbol && grid[2][1] === symbol && grid[2][2] === symbol));

        vertical = ((grid[0][0] === symbol && grid[1][0] === symbol && grid[2][0] === symbol) ||
                   (grid[0][1] === symbol && grid[1][1] === symbol && grid[2][1] === symbol) ||
                   (grid[0][2] === symbol && grid[1][2] === symbol && grid[2][2] === symbol));

        diagonal = ((grid[0][0] === symbol && grid[1][1] === symbol && grid[2][2] === symbol) ||
                   (grid[2][0] === symbol && grid[1][1] === symbol && grid[0][2] === symbol));

        // Either player or CPU won
        if (horizontal || vertical || diagonal) {
            return symbol;
        }
    }

    // Check if there are still tiles left
    for (var i = 0; i < grid.length; i++) {
        for (var j = 0; j < grid[i].length; j++) {
            if (grid[i][j] === "") {
                return "";
            }
        }
    }

    // Game is tied
    return "tied";

}


function resetVariables() {
    // Reset variables
    grid = [
        ["", "", ""],  
        ["", "", ""],
        ["", "", ""]  
    ];
    CPU_mode = "";

    // Delete all grid text in html elements
    for (var i = 0; i < grids.length; i++) {
        grids[i].children[0].textContent = "";
    }

    gameOverOverlay.style.display = "none";
}


function hardCPUMove() {
    // Check for any winning moves
    for (var i = 0; i < grid.length; i++) {
        for (var j = 0; j < grid[i].length; j++) {
            if (grid[i][j] === "") {
                grid[i][j] = CPU_Tile;
                if (gameStatus() === CPU_Tile) {
                    grid[i][j] = "";
                    return [i, j];
                }
                grid[i][j] = "";
            }
        }
    }

    // Check for any losing moves
    for (var i = 0; i < grid.length; i++) {
        for (var j = 0; j < grid[i].length; j++) {
            if (grid[i][j] === "") {
                grid[i][j] = playerTile;
                if (gameStatus() === playerTile) {
                    grid[i][j] = "";
                    return [i, j];
                }
                grid[i][j] = "";
            }
        }
    }

    // Pick a random move
    move = [Math.floor(Math.random() * 3), Math.floor(Math.random() * 3)];
    while (grid[move[0]][move[1]] !== "") {
        move[0] = Math.floor(Math.random() * 3);
        move[1] = Math.floor(Math.random() * 3);
    }
    return move;
}


function minimaxHelper(isMaximizing) {
    bestTile = 0;
    bestCalc = Number.MIN_SAFE_INTEGER;

    // Check every available move
    for (var i = 0; i < grid.length; i++) {
        for (var j = 0; j < grid[i].length; j++) {
            if (grid[i][j] === "") {
                grid[i][j] = CPU_Tile;

                currentCalc = minimax(!isMaximizing, 1);
                if (currentCalc > bestCalc) {
                    bestCalc = currentCalc;
                    bestTile = [i, j];
                }
 
                grid[i][j] = "";
            }
        }
    }

    // Return the move with the best calculation
    return bestTile;
}


function minimax(isMaximizing, depth) {
    // Check if game is tied
    currentStatus = gameStatus();
    if (currentStatus === "tied") {
        return 0;
    }

    if (!isMaximizing) {  // Player's Turn
        // Check if the CPU made a winning move
        if (currentStatus === CPU_Tile) {
            return (10 - depth);  // Return a positive value (good move for CPU)
        }

        // Find the best move the player can make
        localBestCalc = Number.MAX_SAFE_INTEGER;
        for (var i = 0; i < grid.length; i++) {
            for (var j = 0; j < grid[i].length; j++) {
                if (grid[i][j] === "") {
                    grid[i][j] = playerTile;
                    localBestCalc = Math.min(localBestCalc, minimax(!isMaximizing, depth + 1));
                    grid[i][j] = "";
                }
            }
        }

        return localBestCalc;
    }

    else {  // CPU's turn
        // Check if the player made a winning move
        if (currentStatus === playerTile) {
            return -10 + depth;  // Return a negative value (bad move for CPU)
        }

        // Find the best move the CPU can make
        localBestCalc = Number.MIN_SAFE_INTEGER;
        for (var i = 0; i < grid.length; i++) {
            for (var j = 0; j < grid[i].length; j++) {
                if (grid[i][j] === "") {
                    grid[i][j] = CPU_Tile;
                    localBestCalc = Math.max(localBestCalc, minimax(!isMaximizing, depth + 1));
                    grid[i][j] = "";
                }
            }
        }

        return localBestCalc;
    }
}


function EasyCPUMove() {
    worstTile = 0;
    worstCalc = Number.MAX_SAFE_INTEGER;

    // Check every available move
    for (var i = 0; i < grid.length; i++) {
        for (var j = 0; j < grid[i].length; j++) {
            if (grid[i][j] === "") {
                grid[i][j] = CPU_Tile;

                currentCalc = minimax(false, 1);
                if (currentCalc < worstCalc) {
                    worstCalc = currentCalc;
                    worstTile = [i, j];
                }
 
                grid[i][j] = "";
            }
        }
    }

    // Return the move with the best calculation
    return worstTile;
}

