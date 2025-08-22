class KeyboardPlugin extends InputPlugin {

    KEY_DOWN = "keydown";
    KEY_UP = "keyup";

    constructor(controller) {
        super(controller, "keyboard");
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

    handleKeyDown = (e) => {
        if (!this.controller.focused || !this.controller.enabled) return;
        if (this.pressedKeys.has(e.keyCode)) return;

        this.pressedKeys.add(e.keyCode);
        super.executeDownAction(e.keyCode);
    }

    handleKeyUp = (e) => {
        if (!this.controller.focused || !this.controller.enabled) return;

        this.pressedKeys.delete(e.keyCode);
        super.executeUpAction(e.keyCode);
    } 
}