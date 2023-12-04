import { createVar, style, styleVariants } from "@vanilla-extract/css";

export const transitionDurationVar = createVar();
export const transitionPropertiesVar = createVar();

export const animationStyles = style({
  transitionDuration: transitionDurationVar,
  transitionProperty: transitionPropertiesVar,
});

export const animationTransitionNone = style({ transition: "none" });

export const animationTimingFunctionStyleVariants = styleVariants({
  easeLinear: { transitionTimingFunction: "linear" },
  easeIn: { transitionTimingFunction: "cubic-bezier(0.4, 0, 1, 1)" },
  easeOut: { transitionTimingFunction: "cubic-bezier(0, 0, 0.2, 1)" },
  easeInOut: { transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)" },
});
