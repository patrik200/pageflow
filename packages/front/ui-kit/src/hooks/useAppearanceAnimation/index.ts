import React from "react";
import { useEffectSkipFirst } from "@worksolutions/react-utils";
import cn from "classnames";
import { assignInlineVars } from "@vanilla-extract/dynamic";

import {
  animationStyles,
  animationTimingFunctionStyleVariants,
  animationTransitionNone,
  transitionDurationVar,
  transitionPropertiesVar,
} from "./style.css";

export type AppearanceAnimationStates = "none" | "hidden" | "visible" | "appearing" | "hiding";
export type AppearanceAnimation = Record<"from" | "to", string> & {
  transitionProperties: string[];
  duration: number;
  timingFunction?: "easeLinear" | "easeIn" | "easeOut" | "easeInOut";
};

export function useAppearanceAnimation(
  visible: boolean,
  { from, to, duration, timingFunction = "easeInOut", transitionProperties }: AppearanceAnimation,
  renderOnNone = false,
) {
  const [state, setState] = React.useState<AppearanceAnimationStates>(() => (visible ? "visible" : "none"));
  const timers = React.useRef<{ appearing: any; visible: any; hidden: any; none: any }>({
    appearing: null,
    visible: null,
    hidden: null,
    none: null,
  });

  const setVisible = React.useCallback(() => {
    clearTimeout(timers.current.hidden);
    clearTimeout(timers.current.none);

    setState("hidden");
    timers.current.appearing = setTimeout(setState, 100, "appearing");
    timers.current.visible = setTimeout(setState, duration + 200, "visible");
  }, [duration]);

  const setHidden = React.useCallback(() => {
    clearTimeout(timers.current.appearing);
    clearTimeout(timers.current.visible);

    setState("hiding");
    timers.current.hidden = setTimeout(setState, duration, "hidden");
    timers.current.none = setTimeout(setState, duration + 10, "none");
  }, [duration]);

  useEffectSkipFirst(() => (visible ? setVisible() : setHidden()), [visible, setVisible, setHidden]);

  const animationClassName = React.useMemo(() => {
    const common = [animationStyles, animationTimingFunctionStyleVariants[timingFunction]];

    if (renderOnNone && state === "none") return cn([animationTransitionNone, from, common]);
    if (state === "hidden") return cn([animationTransitionNone, from, common]);
    if (state === "appearing") return cn([to, common]);
    if (state === "visible") return cn([animationTransitionNone, to, common]);
    if (state === "hiding") return cn([from, common]);
    return "";
  }, [from, renderOnNone, state, timingFunction, to]);

  const animationStyleProp = React.useMemo(
    () =>
      assignInlineVars({
        [transitionDurationVar]: duration.toString() + "ms",
        [transitionPropertiesVar]: transitionProperties.join(","),
      }),
    [duration, transitionProperties],
  );

  return [{ animationClassName, animationStyle: animationStyleProp }, state !== "none", state] as const;
}
