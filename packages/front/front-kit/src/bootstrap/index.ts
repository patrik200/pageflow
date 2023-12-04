import { entries } from "@worksolutions/utils";

import { runBrowserInitializers } from "../framework";
import { InternalVariables, setVariable } from "./variables";

export function bootstrap(variables: InternalVariables) {
  entries(variables).forEach(([key, value]) => setVariable(key, value));
  runBrowserInitializers();
}

export * from "./customVariableGetters";
export * from "./variables";
