class InputController {
    
    enabled = true;
    focused = true;

    ACTION_ACTIVATED = "input-controller:action-activated";
    ACTION_DEACTIVATED = "input-controller:action-deactivated";

    BLUR = "blur";
    FOCUS = "focus";

    constructor(actionsToBind = {}, target = null) {
        
        this.actionsToBind = {};

        this.enabledActions = new Set();

        this.target = target;

        window.addEventListener(this.BLUR, () => {
            this.focused = false;
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
                    sources: {},
                    enabled: true,
                    pressedButtons: 0
                };
            }

            for (const deviceType of Object.keys(actionData)) {
                if (typeof actionData[deviceType] !== 'object' ||
                     (typeof actionData[deviceType] === 'object' && !actionData[deviceType].buttons)
                ) continue;

                if (Object.hasOwn(actionData, deviceType)) {
                    if (!this.actionsToBind[actionName].sources[deviceType]) {
                        this.actionsToBind[actionName].sources[deviceType] = {["buttons"]: [], active: false}
                    }
                }
                actionData[deviceType].buttons.forEach(button => {
                    if (!this.actionsToBind[actionName].sources[deviceType].buttons.includes(button)) {
                        this.actionsToBind[actionName].sources[deviceType].buttons.push(button);
                    }
                });
            }

            if (this.actionsToBind[actionName].enabled) {
                this.enabledActions.add(actionName);
            }
        }
    }

    clearAllActiveActions() {
        for (const actionName of Object.keys(this.actionsToBind)) {
            for (const source of Object.values(this.actionsToBind[actionName].sources)) {
                if (typeof source === 'object') {
                    source.active = false;
                }
            }
        }
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
    }

    detach() {
        if (!this.target) return;

        this.clearAllActiveActions();
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
}