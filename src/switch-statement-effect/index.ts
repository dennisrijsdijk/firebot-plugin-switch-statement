import { Firebot, ScriptModules } from "@crowbartools/firebot-custom-scripts-types";
import optionsTemplate from "./index.html";

type SwitchCase = {
    label?: string;
    type?: "compare" | "range";
    value?: string;
    min?: string | number; // because of HTML input types, these can be strings or numbers
    max?: string | number;
    effectList?: unknown;
    fallthrough?: boolean;
}

type EffectModel = {
    value: string;
    cases: SwitchCase[];
    defaultCase: SwitchCase;
    bubbleOutputs: boolean;
}

type Scope = ng.IScope & {
    effect: EffectModel;
    openFirst: boolean;
    sortableOptions: unknown;
    addCase(): void;
    deleteCase(index: number): void;
    effectListUpdated(effects: unknown, index: number | "default"): void;
    getAutomaticLabel(switchCase: SwitchCase): string;
}

export default function registerSwitchEffect(modules: ScriptModules) {
    const hasFirebotSwitchEffect = !!modules.effectManager.getEffectById("firebot:switch-statement");
    const effect: Firebot.EffectType<EffectModel> = {
        definition: {
            id: "dennisontheinternet:switch-statement",
            name: "Switch Statement",
            description: "Simplified conditional effect for use with a single input",
            icon: "far fa-code-branch",
            categories: ["advanced", "scripting"],
            // @ts-expect-error
            hidden: hasFirebotSwitchEffect
        },
        optionsTemplate,
        // @ts-expect-error
        optionsController: ($scope: Scope, utilityService: any) => {
            $scope.sortableOptions = {
                handle: ".dragHandle",
                stop: () => { }
            };

            $scope.addCase = () => {
                $scope.effect.cases.push({
                    type: "compare"
                });
            }

            $scope.getAutomaticLabel = (switchCase: SwitchCase) => {
                if (!switchCase || !switchCase.type) {
                    return "No condition";
                }

                if (switchCase.type === "compare") {
                    return switchCase.value || "No value";
                }

                if (switchCase.type === "range" && (switchCase.min == null || switchCase.max == null || isNaN(Number(switchCase.min)) || isNaN(Number(switchCase.max)) || Number(switchCase.min) >= Number(switchCase.max))) {
                    return "Invalid Number Range";
                }

                return `${switchCase.min}-${switchCase.max}`;
            };

            $scope.deleteCase = (index: number) => {
                utilityService.showConfirmationModal({
                    title: "Remove Case",
                    question: `Are you sure you want to remove this switch case?`,
                    confirmLabel: "Remove",
                    confirmBtnType: "btn-danger"
                }).then((confirmed: boolean) => {
                    if (confirmed) {
                        $scope.effect.cases.splice(index, 1);
                    }
                });
            };

            $scope.effectListUpdated = (effects: unknown, index: number | "default") => {
                if (index === "default") {
                    $scope.effect.defaultCase.effectList = effects;
                } else {
                    $scope.effect.cases[index].effectList = effects;
                }
            };

            if ($scope.effect.cases == null) {
                $scope.openFirst = true;
                $scope.effect.cases = [{
                    type: "compare",
                }];
            }

            if ($scope.effect.defaultCase == null) {
                $scope.effect.defaultCase = {};
            }
        },
        optionsValidator: (effect: EffectModel) => {
            if (!effect.value || effect.value.toString().trim() === "") {
                return ["Value is required."];
            }

            if (effect.cases.some(switchCase => {
                return switchCase.type === "range" &&
                    (switchCase.min == null || switchCase.max == null ||
                        Number.isNaN(Number(switchCase.min)) || Number.isNaN(Number(switchCase.max)) ||
                        Number(switchCase.min) >= Number(switchCase.max));
            })) {
                return ["Invalid number range in one or more cases. Make sure Minimum and Maximum are set correctly."];
            }
        },
        async onTriggerEvent(event) {
const { effect, trigger, outputs, abortSignal } = event;
            const value = effect.value;
            const stringValue = typeof value === "string" ? value : String(value);
            const numberValue = typeof value === "number" ? value : Number(value);

            let fallthrough = false;

            let effectList: any;

            for (const switchCase of effect.cases) {
                if (fallthrough && !switchCase.fallthrough) {
                    effectList = switchCase.effectList;
                    break;
                } else if (fallthrough && switchCase.fallthrough) {
                    continue;
                }

                if (switchCase.type === "compare") {
                    if (switchCase.value == null || stringValue === switchCase.value) {
                        if (switchCase.fallthrough) {
                            fallthrough = true;
                        } else {
                            effectList = switchCase.effectList;
                            break;
                        }
                    }
                } else {
                    if (switchCase.min != null && switchCase.max != null &&
                        numberValue >= Number(switchCase.min) &&
                        numberValue <= Number(switchCase.max)) {
                        if (switchCase.fallthrough) {
                            fallthrough = true;
                        } else {
                            effectList = switchCase.effectList;
                            break;
                        }
                    }
                }
            }

            if (!effectList) {
                effectList = effect.defaultCase.effectList;
            }

            if (!effectList || abortSignal?.aborted) {
                return;
            }

            return modules.effectRunner.processEffects({
                trigger: trigger,
                // @ts-expect-error
                outputs,
                effects: effectList,
            }).then((result) => {
                if (result?.success && result?.stopEffectExecution) {
                    return {
                        success: true,
                        outputs: result.outputs,
                        execution: {
                            stop: true,
                            bubbleStop: true,
                        }
                    };
                }

                return {
                    success: true,
                    outputs: effect.bubbleOutputs ? result?.outputs : undefined,
                };
            });
        },
    }

    modules.effectManager.registerEffect(effect);
}