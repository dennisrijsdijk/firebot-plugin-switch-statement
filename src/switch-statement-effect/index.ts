import { Firebot, ScriptModules } from "@crowbartools/firebot-custom-scripts-types";
import optionsTemplate from "./index.html";

type EffectModel = {

}

type Scope<TEffect> = ng.IScope & {
    effect: TEffect;
}

export default function registerSwitchEffect(modules: ScriptModules) {
    const effect: Firebot.EffectType<EffectModel> = {
        definition: {
            id: "dennisontheinternet:switch-statement",
            name: "Switch Statement",
            description: "Simplified conditional effect for use with a single input",
            icon: "far fa-code-branch",
            categories: ["advanced", "scripting"]
        },
        optionsTemplate,
        optionsController: ($scope: Scope<EffectModel>) => {

        },
        async onTriggerEvent(event) {

        },
    }

    modules.effectManager.registerEffect(effect);
}