class InputPlugin {
    constructor(controller) {
        this.controller = controller;
    }

    wasActionActive(action) {
        for (const data of Object.values(this.controller.actionsToBind[action])) {
            if (typeof data === 'object' && data.active) {
                return true;
            }
        }
        return false;
    }
}