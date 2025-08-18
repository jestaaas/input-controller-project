class InputController {

    enabled = true;
    focused = true;
    ACTION_ACTIVATED = "input-controller:activate";
    ACTION_DEACTIVATED = "input-controller:deactivate";

    COLOR_MAGENTA = "magenta";
    COLOR_RED = "red";
    COLOR_YELLOW = "yellow";
    COLOR_CYAN = "cyan";
    COLOR_BLUE = "blue";
    COLOR_BLACK = "black";
    COLOR_GREEN = "green";

    constructor(actionsToBind = null, target = null) {
        this.actionsToBind = actionsToBind;
        this.target = target;

        window.addEventListener("blur", () => {
            this.focused = false;
        });
        window.addEventListener("focus", () => {
            this.focused = true;
        });

        if (this.target != null) {
            this.addListenersForElement();
        }

    }

    addListenersForElement() {
        this.target.addEventListener(this.ACTION_ACTIVATED, (event) => {
            if (!this.focused) return;
            
            switch(event.detail) {
                case "attach":
                    this.attach(this.target);
                    break;
                case "detach":
                    this.detach();
                    break;
                case "activation":
                    this.enableAction("detach");
                    break;
                case "deactivation":
                    this.disableAction("detach");
                    break;
                case "bind":
                    this.bindActions({"jump": {keys: [" "], enabled: true}})
                    break;
                case "jump":
                    this.jump();
                    break;
            }
        })
        this.target.addEventListener(this.ACTION_DEACTIVATED, (event) => {
            console.log(event.detail + " deactivated");
        })
    }

    findActionByKey(keyCode) {
        const keys = Object.keys(this.actionsToBind);

        for (const key of keys) {
            for (const item of this.actionsToBind[key].keys) {
                if (item == keyCode) {
                    return key;
                }
            }
        }
    }

    bindActions(actionsToBind) {
        if (!this.enabled) {
            return;
        }
        this.target.style.backgroundColor = this.COLOR_CYAN;
        if (actionsToBind != null) {
            Object.assign(this.actionsToBind, actionsToBind)
        }
        else {
            this.actionsToBind = actionsToBind;
        }
    }

    enableAction(actionName) {
        const isActive = this.isActionActive(actionName)
        if (!isActive && this.enabled) {
            this.target.style.backgroundColor = this.COLOR_BLUE;
            this.actionsToBind[actionName].enabled = true;
        }
    }

    disableAction(actionName) {
        if (this.enabled) {
            this.target.style.backgroundColor = this.COLOR_BLACK;
            this.actionsToBind[actionName].enabled = false;
        }
    }

    attach(target, dontEnable = false) {
        this.target.style.backgroundColor = this.COLOR_YELLOW;

        if (!dontEnable) {
            this.target = target;
            this.enabled = true;
            this.addListenersForElement();
        }
    }

    detach() {
        if (this.enabled) {
            this.target.style.backgroundColor = this.COLOR_GREEN;
            removeEventListener(this.ACTION_ACTIVATED, () => {}, true);
            removeEventListener(this.ACTION_DEACTIVATED, () => {}, true);
            this.enabled = false;
        }
    }

    isActionActive(action) {
        this.target.style.left = (Math.floor(Math.random() * (500 - 0 + 1)) + 0) + 'px'
        return this.actionsToBind[action].enabled;
    }

    isKeyPressed(keyCode) {
        const values = Object.values(this.actionsToBind);

        for (const value of values) {
            if (value.enabled == false) continue;

            for (const item of value.keys) {
                if (keyCode == item) {
                    return true;
                }
            }
        }
        return false;
    }

    jump() {
        this.target.style.backgroundColor = this.COLOR_MAGENTA;
    }
}