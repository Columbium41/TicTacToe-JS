const buttons = document.getElementsByClassName("difficulty-button");
for (var i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener("click", e => {
        startGame(e.target.innerText);
    });
}

function startGame(difficulty) {
    console.log(`Pressed ${difficulty} button`)
}
