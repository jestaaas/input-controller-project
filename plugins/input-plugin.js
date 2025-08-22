class InputPlugin {
    constructor(controller, deviceType) {
        this.controller = controller;
        this.deviceType = deviceType;
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

    executeDownAction(button) {
        let affectedAction = this.findAffectedAction(button);

        if (affectedAction === "") return;
        let pressedButtonsArray = this.controller.actionsToBind[affectedAction].pressedButtonsArray;

        if (pressedButtonsArray.length === 0) {
            console.log("dispatch true")
            this.controller.dispatchActionEvent(affectedAction, true);
        }

        if(!pressedButtonsArray.includes(button)) pressedButtonsArray.push(button);
    }

    executeUpAction(button) {
        let affectedAction = this.findAffectedAction(button);

        if (affectedAction === "") return;

        const actionData = this.controller.actionsToBind[affectedAction];

        const pressedButtonsArray = actionData.pressedButtonsArray;
        const firstPressedButton = pressedButtonsArray[0];
        actionData.pressedButtonsArray = pressedButtonsArray.filter((buttonToDelete) => buttonToDelete != button);

        if (actionData.pressedButtonsArray.length === 0) {
            console.log("dispatch false")
            this.controller.dispatchActionEvent(affectedAction, false);
        }
        else if (firstPressedButton === button) {
            console.log("dispatch false")
            this.controller.dispatchActionEvent(affectedAction, false);
            console.log("dispatch true")
            this.controller.dispatchActionEvent(affectedAction, true);
        }
    }
}