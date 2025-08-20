const initialActions1 = {
    random: {
        keyboard: {keys: [90, 88]},
        mouse: {buttons: [0]},
        enabled: true,
        active: false
    },
    left: { keyboard: { keys: [65, 37]}, enabled: true, active: false }, //a, left
    right: { keyboard: { keys: [68, 39]}, enabled: true, active: false }, //d, right
    up: { keyboard: { keys: [87, 38]}, enabled: true, active: false }, //w, up
    down: { keyboard: { keys: [83, 40]}, enabled: true, active: false }, //s, down
}

const block1 = document.getElementById("actionBlock");

const COLOR_MAGENTA = "magenta";
const COLOR_RED = "red";
const COLOR_YELLOW = "yellow";
const COLOR_CYAN = "cyan";
const COLOR_BLUE = "blue";
const COLOR_BLACK = "black";
const COLOR_GREEN = "green";

const colors = [COLOR_MAGENTA, COLOR_BLACK, COLOR_BLUE, COLOR_CYAN, COLOR_GREEN, COLOR_RED, COLOR_YELLOW];

let inputController = new InputController(initialActions1, block1);
let keyBoardPlugin = new KeyboardPlugin(inputController);
let mousePlugin = new MousePlugin(inputController);

let posX = 100;
let posY = 100;

inputController.target.addEventListener(inputController.ACTION_ACTIVATED, (e) => {
    switch(e.detail) {
        case "random":
            console.log("clicked")
            inputController.target.style.backgroundColor = colors[getRandomInt(colors.length - 1)];
            break;
        case "left":
            posX -= 50;
            inputController.target.style.left = posX + "px";
            break;
        case "right":
            posX += 50;
            inputController.target.style.left = posX + "px";
            break;
        case "up":
            posY -= 50;
            inputController.target.style.top = posY + "px";
            break;
        case "down":
            posY += 50;
            inputController.target.style.top = posY + "px";
            break;
    }
})

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}