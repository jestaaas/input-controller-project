class KeyboardPlugin extends InputPlugin {

    KEY_DOWN = "keydown";
    KEY_UP = "keyup";

    constructor(controller, deviceType) {
        super(controller, deviceType);
        this.pressedKeys = new Set();

        this.enablePlugin();
    }

    enablePlugin() {
        document.addEventListener(this.KEY_DOWN, this.handleKeyDown);
        document.addEventListener(this.KEY_UP, this.handleKeyUp);
    }

    disablePlugin() {
        document.removeEventListener(this.KEY_DOWN, this.handleKeyDown);
        document.removeEventListener(this.KEY_UP, this.handleKeyUp);
    }

    isKeyPressed(keyCode) {
        return this.pressedKeys.has(keyCode);
    }

    handleKeyDown = (e) => {
        if (!this.controller.focused || !this.controller.enabled) return;
        if (this.pressedKeys.has(e.keyCode)) return;

        this.pressedKeys.add(e.keyCode);
        this.checkActionForKey(e.keyCode, true);
    }

    handleKeyUp = (e) => {
        if (!this.controller.focused || !this.controller.enabled) return;

        this.pressedKeys.delete(e.keyCode);
        this.checkActionForKey(e.keyCode, false);
    }

    checkActionForKey(keyCode, isKeyDown) {
        let affectedAction = "";

        for (const [actionName, actionData] of Object.entries(this.controller.actionsToBind)) {
            const source = actionData.sources[this.deviceType];
            if (source && source.buttons.includes(keyCode) && this.controller.enabledActions.has(actionName)) {
                affectedAction = actionName;
                break;
            }
        }

        const wasActive = super.wasActionActive(affectedAction);
        const isActive = this.isActionActive(affectedAction);

        if (isKeyDown && isActive && !wasActive) {
            this.controller.actionsToBind[affectedAction].sources[this.deviceType].active = true;
            this.controller.dispatchActionEvent(affectedAction, true);
        }
        else if (!isKeyDown && !isActive && wasActive) {
            this.controller.actionsToBind[affectedAction].sources[this.deviceType].active = false;
            this.controller.dispatchActionEvent(affectedAction, false);
        }
    }
    
    isActionActive(actionName) {
        if (!this.controller.actionsToBind[actionName] || !this.controller.enabledActions.has(actionName)) {
            return false;
        }
        return this.controller.actionsToBind[actionName].sources[this.deviceType].buttons.some((keyCode) =>
            this.isKeyPressed(keyCode)
        );
    }
}