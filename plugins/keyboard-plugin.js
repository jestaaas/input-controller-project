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

        let affectedAction = super.findAffectedAction(e.keyCode);

        if (affectedAction === "") return;

        const wasActive = super.wasActionActive(affectedAction);
        const isActive = this.isActionActive(affectedAction);

        if (isActive && !wasActive) {
            this.controller.actionsToBind[affectedAction].sources[this.deviceType].active = true;
            this.controller.dispatchActionEvent(affectedAction, true);
        }
        this.controller.actionsToBind[affectedAction].pressedButtons += 1;
    }

    handleKeyUp = (e) => {
        if (!this.controller.focused || !this.controller.enabled) return;

        this.pressedKeys.delete(e.keyCode);

        let affectedAction = super.findAffectedAction(e.keyCode);

        if (affectedAction === "") return;

        const wasActive = super.wasActionActive(affectedAction);
        const isActive = this.isActionActive(affectedAction);

        if (!isActive && wasActive) {
            this.controller.actionsToBind[affectedAction].sources[this.deviceType].active = false;
            this.controller.dispatchActionEvent(affectedAction, false);
        }
        this.controller.actionsToBind[affectedAction].pressedButtons -= 1;

        if (this.controller.actionsToBind[affectedAction].pressedButtons > 0 && this.controller.actionsToBind[affectedAction].pressedButtons < 2) {
            this.controller.dispatchActionEvent(affectedAction, true);
        }
    } 

    isActionActive(actionName) {
        if (!this.controller.actionsToBind[actionName] || !this.controller.enabledActions.has(actionName)) {
            return false;
        }
        return this.controller.actionsToBind[actionName].sources[this.deviceType].buttons.some((buttonCode) =>
            this.isKeyPressed(buttonCode)
        );
    }
}