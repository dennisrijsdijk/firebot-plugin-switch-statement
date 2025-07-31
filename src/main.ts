import { Firebot } from "@crowbartools/firebot-custom-scripts-types";

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
  run: (runRequest) => { },
};

export default script;
