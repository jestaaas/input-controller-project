const initialActions1 = {
    random: {
        keyboard: {buttons: [90, 88, 67]}, //z, x, c
        mouse: {buttons: [0]}, //left mouse button
    },
    left: { keyboard: { buttons: [65, 37]}}, //a, left
    right: { keyboard: { buttons: [68, 39]}}, //d, right
    up: { keyboard: { buttons: [87, 38]}}, //w, up
    down: { keyboard: { buttons: [83, 40]}}, //s, down
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
            console.log("random")
            inputController.target.style.backgroundColor = colors[getRandomInt(colors.length)];
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