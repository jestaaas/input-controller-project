let testActions = {
    "attach" : {
        keys: ['a'],
        enabled: true
    },
    "detach" : {
        keys: ['d', 'm'],
        enabled: true
    },
    "activation" : {
        keys: ['w'],
        enabled: true
    },
    "deactivation" : {
        keys: ['s'],
        enabled: true
    },
    "bind" : {
        keys: ['b'],
        enabled: true
    },
}

function jump(target) {
    target.style.backgroundColor = "red";
}

const actionBlock = document.getElementById("actionBlock");
let customController = new InputController(testActions, actionBlock);

document.addEventListener("keydown", (event) => {
    if (customController.isKeyPressed(event.key)) {
        const action = customController.findActionByKey(event.key)
        customController.target.dispatchEvent(new CustomEvent(customController.ACTION_ACTIVATED, {detail: action}));
    }

})

document.addEventListener("keyup", (event) => {
    if (customController.isKeyPressed(event.key)) {
        const action = customController.findActionByKey(event.key)
        customController.target.dispatchEvent(new CustomEvent(customController.ACTION_DEACTIVATED, {detail: action}));
    }
})
