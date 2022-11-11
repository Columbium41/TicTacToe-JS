// Player and CPU for each difficulty
var p_scores = [0, 0, 0, 0]
var cpu_scores = [0, 0, 0, 0]
var in_game = false;

// Document Objects
const menu = document.getElementById("menu");
const game = document.getElementById("game");
const buttons = document.getElementsByClassName("difficulty-button");
const grids = document.getElementsByTagName("td");

// Add event listeners to menu buttons
for (var i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener("click", e => {
        startGame(e.target.innerText);
    });
}

// Add event listeners and IDs to tic-tac-toe grids 
for (var i = 0; i < grids.length; i++) {
    grids[i].id = `(${(Math.floor(i/3))},${i%3})`
    grids[i].addEventListener("click", e => {
        place_X(e.target.id);
    });
}

function startGame(difficulty) {
    in_game = true;

    console.log(`Selected ${difficulty} CPU`);

    menu.style.display = "none";
    game.style.display = "block";
}

function place_X(location) {
    console.log(location);
}

