const initialActions = {

    left: { keyboard: { keys: [65, 37]}, enabled: true }, //a, left
    right: { keyboard: { keys: [68, 39]}, enabled: true }, //d, right
    up: { keyboard: { keys: [87, 38]}, enabled: true }, //w, up
    down: { keyboard: { keys: [83, 40]}, enabled: true }, //s, down
}

const actionsForBinding = {
    jump: { keys: [32], enabled: true }, //space
}

const COLOR_MAGENTA = "magenta";
const COLOR_RED = "red";
const COLOR_YELLOW = "yellow";
const COLOR_CYAN = "cyan";
const COLOR_BLUE = "blue";
const COLOR_BLACK = "black";
const COLOR_GREEN = "green";

const colors = [COLOR_MAGENTA, COLOR_BLACK, COLOR_BLUE, COLOR_CYAN, COLOR_GREEN, COLOR_RED, COLOR_YELLOW];

const block = document.getElementById("actionBlock");
const controller = new InputController(
    initialActions,
    block
);

let posX = 100;
let posY = 100;

const movement = () => {
    if (controller.isActionActive("left")) posX -= 2;
    if (controller.isActionActive("right")) posX += 2;
    if (controller.isActionActive("up")) posY -= 2;
    if (controller.isActionActive("down")) posY += 2;

    controller.target.style.left = posX + "px";
    controller.target.style.top = posY + "px";

    requestAnimationFrame(movement);
}

movement();

controller.target.addEventListener(controller.ACTION_ACTIVATED, (e) => {
    switch (e.detail) {
        case "attach":
            if (e.repeat) return;
            controller.attach(block);
            controller.target.style.backgroundColor = COLOR_MAGENTA;
            break;
        case "detach":
            if (e.repeat) return;
            controller.detach();
            controller.target.style.backgroundColor = COLOR_BLACK;
            break;
        case "activation":
            controller.enableAction("detach");
            controller.target.style.backgroundColor = COLOR_YELLOW;
            break;
        case "deactivation":
            controller.disableAction("detach");
            controller.target.style.backgroundColor = COLOR_GREEN;
            break;
        case "bind":
            controller.bindActions(actionsForBinding);
            controller.target.style.backgroundColor = COLOR_BLUE;
            break;
        case "jump":
            controller.target.style.backgroundColor = COLOR_CYAN;
            break;
        case "repeat":
            if (e.repeat) {
                return;
            }
            controller.target.style.backgroundColor = colors[getRandomInt(colors.length)];
    }
});

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}