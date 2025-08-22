class MousePlugin extends InputPlugin {

    MOUSE_DOWN = "mousedown";
    MOUSE_UP = "mouseup";

    constructor(controller) {
        super(controller, "mouse")
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
        super.executeDownAction(e.button);
    }

    handleMouseUp = (e) => {
        if (!this.controller.focused || !this.controller.enabled) return;

        this.pressedButtons.delete(e.button);
        super.executeUpAction(e.button);
    }
}