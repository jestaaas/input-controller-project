class InputPlugin {
    constructor(controller, deviceType) {
        this.controller = controller;
        this.deviceType = deviceType;
    }

    wasActionActive(action) {
        const actionData = this.controller.actionsToBind[action];
        if (!actionData) return;

        for (const data of Object.values(actionData.sources)) {
            if (data.active) return true;
        }
        return false;
    }

    findAffectedAction(button) {       
        for (const [actionName, actionData] of Object.entries(this.controller.actionsToBind)) {
            const source = actionData.sources[this.deviceType];

            if (source && source.buttons.includes(button) && this.controller.enabledActions.has(actionName)) {
                return actionName;
            }
        }

        return "";
    }
}