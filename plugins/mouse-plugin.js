class MousePlugin extends InputPlugin {

    MOUSE_DOWN = "mousedown";
    MOUSE_UP = "mouseup";

    constructor(controller) {
        super(controller)
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
        if(!this.controller.enabled || !this.controller.focused) return;
        if (this.pressedButtons.has(e.button)) return;

        this.pressedButtons.add(e.button);

        this.checkActionForKey(e.button, true);
    }

    handleMouseUp = (e) => {
        if (!this.controller.enabled || !this.controller.focused) return;
        this.pressedButtons.delete(e.button);

        this.checkActionForKey(e.button, false);
    }

    checkActionForKey(buttonCode, isButtonDown) {
        let affectedAction = "";

        for (const [actionName, actionData] of Object.entries(this.controller.actionsToBind)) {
            if (actionData.mouse.buttons.includes(buttonCode) && this.controller.enabledActions.has(actionName)) {
                affectedAction = actionName;
            }
        }
        this.wasActionActive(affectedAction);
        const wasActive = super.wasActionActive(affectedAction);
        const isActive = this.isActionActive(affectedAction);

        if (isButtonDown && isActive && !wasActive) {
            this.controller.actionsToBind[affectedAction].mouse.active = true;
            this.controller.dispatchActionEvent(affectedAction, true);
        }
        else if (!isButtonDown && !isActive && wasActive) {
            this.controller.actionsToBind[affectedAction].mouse.active = false;
            this.controller.dispatchActionEvent(affectedAction, false);
        }
    }

    isActionActive(actionName) {
        if (!this.controller.actionsToBind[actionName] || !this.controller.enabledActions.has(actionName)) {
            return false;
        }
        return this.controller.actionsToBind[actionName].mouse.buttons.some((buttonCode) =>
            this.isButtonPressed(buttonCode)
        );
    }

    isButtonPressed(buttonCode) {
        return this.pressedButtons.has(buttonCode);
    }
}