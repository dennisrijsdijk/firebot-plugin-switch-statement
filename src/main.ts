import { Firebot } from "@crowbartools/firebot-custom-scripts-types";
import switchSectionComponent from "./switch-section-component";
import registerSwitchEffect from "./switch-statement-effect";

interface Params { }

const script: Firebot.CustomScript<Params> = {
  getScriptManifest: () => {
    return {
      name: "Switch Statement",
      description: "A firebot plugin which implements a switch statement effect",
      author: "DennisOnTheInternet",
      version: "1.0",
      firebotVersion: "5",
      startupOnly: true
    };
  },
  getDefaultParameters: () => {
    return { };
  },
  run: (runRequest) => {
    runRequest.modules.uiExtensionManager.registerUIExtension({
      id: "dennisontheinternet:switch-statement",
      pages: [],
      providers: {
        components: [
          switchSectionComponent
        ]
      }
    });

    registerSwitchEffect(runRequest.modules);
  },
};

export default script;
