const initialActions = {
    attach: { keys: [81], enabled: true }, //q
    detach: { keys: [69], enabled: true }, //e
    activation: { keys: [82], enabled: true }, //r
    deactivation: { keys: [84], enabled: true },//t
    bind: {keys: [66], enabled: true},
    left: { keys: [65], enabled: true }, //a, left
    right: { keys: [68], enabled: true }, //d, right
    up: { keys: [87], enabled: true }, //w, up
    down: { keys: [83], enabled: true }, //s, down
}

const actionsForBinding = {
    jump: { keys: [32], enabled: true }, //space
}

COLOR_MAGENTA = "magenta";
COLOR_RED = "red";
COLOR_YELLOW = "yellow";
COLOR_CYAN = "cyan";
COLOR_BLUE = "blue";
COLOR_BLACK = "black";
COLOR_GREEN = "green";

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

controller.target.addEventListener(InputController.ACTION_ACTIVATED, (e) => {
    switch (e.detail) {
        case "attach":
            controller.attach(block);
            controller.target.style.backgroundColor = COLOR_MAGENTA;
            break;
        case "detach":
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
    }
});