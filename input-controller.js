class InputController {

    enabled = true;
    focused = true;

    ACTION_ACTIVATED = "input-controller:action-activated";
    ACTION_DEACTIVATED = "input-controller:action-deactivated";

    BLUR = "blur";
    FOCUS = "focus";
    KEY_DOWN = "keydown";
    KEY_UP = "keyup";

    constructor(actionsToBind = {}, target = null) {
        this.actionsToBind = {};

        this.enabledActions = new Set();
        this.pressedKeys = new Set();
        this.activeActions = new Set();

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
                    keys: [],
                    enabled: true,
                };
            }

            actionData.keys.forEach((keyCode) => {
                if (!this.actionsToBind[actionName].keys.includes(keyCode)) {
                    this.actionsToBind[actionName].keys.push(keyCode);
                }
            });

            if (this.actionsToBind[actionName].enabled) {
                this.enabledActions.add(actionName);
            }
        }
    }

    clearAllActiveActions() {
        this.activeActions.clear();
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

        document.addEventListener(this.KEY_DOWN, this.handleKeyDown);
        document.addEventListener(this.KEY_UP, this.handleKeyUp);
    }

    detach() {
        if (!this.target) return;

        document.removeEventListener(this.KEY_DOWN, this.handleKeyDown);
        document.removeEventListener(this.KEY_UP, this.handleKeyUp);

        this.pressedKeys.clear();
        this.clearAllActiveActions();
    }

    handleKeyDown = (e) => {
        if (!this.enabled || !this.focused) return;
        if (this.pressedKeys.has(e.keyCode)) return;

        this.pressedKeys.add(e.keyCode);
        this.checkActionForKey(e.keyCode, true);
    };

    handleKeyUp = (e) => {
        if (!this.enabled || !this.focused) return;

        this.pressedKeys.delete(e.keyCode);
        this.checkActionForKey(e.keyCode, false);
    };

    checkActionForKey(keyCode, isKeyDown) {
        let affectedAction = "";

        for (const [actionName, actionData] of Object.entries(this.actionsToBind)) {
            if (actionData.keys.includes(keyCode) && this.enabledActions.has(actionName)) {
                affectedAction = actionName;
            }
        }

        const wasActive = this.activeActions.has(affectedAction);
        const isActive = this.isActionActive(affectedAction);

        if (isKeyDown && isActive && !wasActive) {
            this.activeActions.add(affectedAction);
            this.dispatchActionEvent(affectedAction, true);
        }
        else if (!isKeyDown && !isActive && wasActive) {
            this.activeActions.delete(affectedAction);
            this.dispatchActionEvent(affectedAction, false);
        }
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

    isActionActive(actionName) {
        if (!this.actionsToBind[actionName] || !this.enabledActions.has(actionName)) {
            return false;
        }
        return this.actionsToBind[actionName].keys.some((keyCode) =>
            this.isKeyPressed(keyCode)
        );
    }

    isKeyPressed(keyCode) {
        return this.pressedKeys.has(keyCode);
    }
}