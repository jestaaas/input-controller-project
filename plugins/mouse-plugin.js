class MousePlugin extends InputPlugin {

    MOUSE_DOWN = "mousedown";
    MOUSE_UP = "mouseup";

    constructor(controller, deviceType) {
        super(controller, deviceType)
        this.pressedButtons = new Set();

        this.enablePlugin();
    }

    enablePlugin() {
        document.addEventListener(this.MOUSE_DOWN, this.handleMouseDown);
        document.addEventListener(this.MOUSE_UP, this.handleMouseUp);
    }

    disablePlugin() {
        document.removeEventListener(this.MOUSE_DOWN, this.handleMouseDown);
        document.removeEventListener(this.MOUSE_UP, this.handleMouseUp);
    }

    handleMouseDown = (e) => {
        if (!this.controller.focused || !this.controller.enabled) return;
        if (this.pressedButtons.has(e.button)) return;
        this.pressedButtons.add(e.button);

        let affectedAction = super.findAffectedAction(e.button);

        if (affectedAction === "") return;

        const wasActive = super.wasActionActive(affectedAction);
        const isActive = this.isActionActive(affectedAction);

        if (isActive && !wasActive) {
            this.controller.actionsToBind[affectedAction].sources[this.deviceType].active = true;
            console.log("dispatch true")
            this.controller.dispatchActionEvent(affectedAction, true);
        }
        this.controller.actionsToBind[affectedAction].pressedButtons += 1;
    }

    handleMouseUp = (e) => {
        if (!this.controller.focused || !this.controller.enabled) return;

        this.pressedButtons.delete(e.button);

        let affectedAction = super.findAffectedAction(e.button);

        if (affectedAction === "") return;

        const wasActive = super.wasActionActive(affectedAction);
        const isActive = this.isActionActive(affectedAction);

        if (!isActive && wasActive && this.controller.actionsToBind[affectedAction].pressedButtons == 1) {
            this.controller.actionsToBind[affectedAction].sources[this.deviceType].active = false;
            console.log("dispatch false");
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
            this.isButtonPressed(buttonCode)
        );
    }

    isButtonPressed(buttonCode) {
        return this.pressedButtons.has(buttonCode);
    }
}
