import type { StyleRule } from "@vanilla-extract/css";
import { isString } from "@worksolutions/utils";

export function breakpointsBuilder<MODE extends string>(mediaBreakpoints: Record<MODE, string | string[]>) {
  return function (mode: MODE, options: StyleRule) {
    const rule = mediaBreakpoints[mode];
    if (isString(rule)) return { [`(${rule})`]: options };
    return { [rule.join("")]: options };
  };
}
