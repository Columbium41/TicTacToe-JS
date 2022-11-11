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
returnButton.addEventListener("click", e => {
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

    // If it's the CPU's turn, let them make a move
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
        gameStatus();
    }
}


function CPUmove() {
    if (CPU_mode === "Easy") {

    }
    else if (CPU_mode === "Normal") {

    }
    else if (CPU_mode === "Hard") {

    }
    else if (CPU_mode === "Impossible") {

    }
    
   //playerTurn = true;
}


function gameStatus() {
    // Check if either the player or CPU won
    ["X", "O"].forEach((symbol) => {
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
            inGame = false;
            gameOverOverlay.style.display = "block";
            // Alert the winner and increment scores
            if (playerTile === symbol) {
                p_scores[CPU_mode]++; 
                alert(`Player won the game! The score is ${p_scores[CPU_mode]} - ${cpu_scores[CPU_mode]}`);
            }
            else {
                cpu_scores[CPU_mode]++;
                alert(`CPU won the game! The score is ${p_scores[CPU_mode]} - ${cpu_scores[CPU_mode]}`);
            }
            return;
        }
    });

    // Check if there are still tiles left
    for (var i = 0; i < grid.length; i++) {
        for (var j = 0; j < grid[i].length; j++) {
            if (grid[i][j] === "") {
                return;
            }
        }
    }

    // Game is tied
    inGame = false;
    gameOverOverlay.style.display = "block";
    alert(`Game is tied! The score is ${p_scores[CPU_mode]} - ${cpu_scores[CPU_mode]}`);

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


function minimaxHelper() {

}

