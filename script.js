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
var in_game = false;
var player_turn = false;
var grid = [
    ["", "", ""],  
    ["", "", ""],
    ["", "", ""]  
];
player_tile = "";
CPU_tile = "";
CPU_mode = "";

// Document Objects
const menu = document.getElementById("menu");
const game = document.getElementById("game");
const buttons = document.getElementsByClassName("difficulty-button");
const grids = document.getElementsByTagName("td");
const info = document.getElementById("info");

// Add event listeners to menu buttons
for (var i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener("click", e => {
        startGame(e.target.innerText);
    });
}

// Add event listeners and IDs to tic-tac-toe grids 
for (var i = 0; i < grids.length; i++) {
    row = Math.floor(i / 3);
    col = i % 3;
    grids[i].id = `${row},${col}`

    grids[i].addEventListener("click", e => {
        place_tile(e.target.id);
    });
}

function startGame(difficulty) {
    in_game = true;
    CPU_mode = difficulty;
    
    // Determine whether the player or cpu goes first
    if (Math.floor(Math.random() * 2) === 0) {
        player_turn = true;
        player_tile = "X";
        CPU_tile = "O";
    }
    else {
        player_turn = false;
        player_tile = "O";
        CPU_tile = "X";
    }

    // Set text for information labels
    info.children[0].textContent = `Player vs. ${difficulty} CPU`;
    info.children[1].textContent = `${((player_turn) ? ("Player") : ("CPU"))} Turn`

    // Change interfaces
    menu.style.display = "none";
    game.style.display = "block";
}

function place_tile(location) {
    // Get the location of the tile the user wants to select
    split = location.split(",");
    r = split[0];
    c = split[1];

    // Check if a tile can be placed there
    if (in_game && player_turn && grid[r][c] === "") {
        player_turn = false;
        tile = document.getElementById(location);

        grid[r][c] = player_tile;
        tile.children[0].textContent = player_tile;
        info.children[1].textContent = `${((player_turn) ? ("Player") : ("CPU"))} Turn`;
        game_status();
    }
}

function game_status() {
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
            // Alert the winner and increment scores
            if (player_tile === symbol) {
                alert("Player won the game!");
                p_scores[CPU_mode]++; 
            }
            else {
                alert("CPU won the game!");
                cpu_scores[CPU_mode]++;
            }
            // Reset variables
            in_game = false;
            grid = [
                ["", "", ""],  
                ["", "", ""],
                ["", "", ""]  
            ];

            // Go back to menu interface
            game.style.display = "none";
            menu.style.display = "flex";
        }
    });
}

