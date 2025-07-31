import { AngularJsComponent } from "@crowbartools/firebot-custom-scripts-types/types/modules/ui-extension-manager";
import template from "./index.html";

type Scope = ng.IScope & {
    $ctrl: any;
    hidePanel: boolean;
}

const component: AngularJsComponent = {
    name: "pluginSwitchSection",
    template,
    bindings: {
        header: "@",
        label: "<",
        autoLabel: "<",
        initiallyOpen: "<?",
    },
    transclude: true,
    controller: ($scope: Scope, utilityService: any) => {
        const $ctrl = $scope.$ctrl;

        $ctrl.$onInit = () => {
            if ($ctrl.draggable == null) {
                $ctrl.draggable = true;
            }
            if ($ctrl.initiallyOpen !== undefined) {
                $scope.hidePanel = $ctrl.initiallyOpen !== true;
            } else {
                $scope.hidePanel = true;
            }
        };
        $ctrl.showEditLabelModal = () => {
            utilityService.openGetInputModal(
                {
                    model: $ctrl.label,
                    label: "Clause Label",
                    saveText: "Save",
                    validationFn: () => {
                        return new Promise(resolve => {
                            resolve(true);
                        });
                    },
                    validationText: ""

                },
                (newLabel: string) => {
                    $ctrl.label = newLabel;
                });
        };
    }
};

export default component;