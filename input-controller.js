class InputController {

    enabled = true;
    focused = true;

    ACTION_ACTIVATED = "input-controller:action-activated";
    ACTION_DEACTIVATED = "input-controller:action-deactivated";

    BLUR = "blur";
    FOCUS = "focus";

    constructor(actionsToBind = {}, target = null) {
        this.actionsToBind = {};

        this.enabledActions = new Set();
        this.pressedKeys = new Set();

        this.target = target;

        window.addEventListener(this.BLUR, () => {
            this.focused = false;
            this.pressedKeys.clear();
            this.clearAllActiveActions();
        });
        window.addEventListener(this.FOCUS, () => {
            this.focused = true;
        });

        this.bindActions(actionsToBind);

        if (this.target) {
            this.attach(this.target);
        }
    }

    bindActions(actionsToBind) {
        for (const [actionName, actionData] of Object.entries(actionsToBind)) {
            if (!this.actionsToBind[actionName]) {
                this.actionsToBind[actionName] = {
                    keyboard: {keys: []},
                    mouse: {buttons: []},
                    enabled: true,
                    active: false
                };
            }

            if (Object.hasOwn(actionData, "keyboard")) {
                actionData.keyboard.keys.forEach((keyCode) => {
                    if (!this.actionsToBind[actionName].keyboard.keys.includes(keyCode)) {
                        this.actionsToBind[actionName].keyboard.keys.push(keyCode);
                    }
                })
            }

            if (Object.hasOwn(actionData, "mouse")) {
                actionData.mouse.buttons.forEach((button) => {
                    if (!this.actionsToBind[actionName].mouse.buttons.includes(button)) {
                        this.actionsToBind[actionName].mouse.buttons.push(button);
                    }
                })
            }

            if (this.actionsToBind[actionName].enabled) {
                this.enabledActions.add(actionName);
            }
        }
    }

    clearAllActiveActions() {
        for (const actionName of Object.keys(this.actionsToBind)) {
            this.actionsToBind[actionName].active = false;
        }
    }

    enableAction(actionName) {
        if (this.actionsToBind[actionName]) {
            this.actionsToBind[actionName].enabled = true;
            this.enabledActions.add(actionName);
        }
    }

    disableAction(actionName) {
        if (this.actionsToBind[actionName]) {
            this.actionsToBind[actionName].enabled = false;
            this.enabledActions.delete(actionName);
        }
    }

    attach(target, dontEnable = false) {
        if (!dontEnable) this.enable = true;

        this.detach();
        this.target = target;
    }

    detach() {
        if (!this.target) return;

        this.pressedKeys.clear();
        this.clearAllActiveActions();
    }

    dispatchActionEvent(actionName, isActivated) {
        if (!this.target) return;

        const eventType = isActivated ? this.ACTION_ACTIVATED : this.ACTION_DEACTIVATED;

        const newEvent = new CustomEvent(eventType, {
            detail: actionName,
        })

        this.target.dispatchEvent(
            newEvent
        );
    }

}