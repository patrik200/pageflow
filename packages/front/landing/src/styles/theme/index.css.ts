import { createGlobalThemeContract } from "@vanilla-extract/css";

import { colors, Colors } from "./colors";

export const globalThemeColorVars = createGlobalThemeContract<Record<Colors, string>>(
  Object.fromEntries(Object.keys(colors).map((key) => [key, key] as const)) as any,
);

export { colors } from "./colors";
export type { Colors } from "./colors";
