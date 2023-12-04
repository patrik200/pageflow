import React from "react";
import cn from "classnames";

import Spinner from "primitives/Spinner";

import { AppearanceAnimation, useAppearanceAnimation } from "hooks/useAppearanceAnimation";

import { appearanceStyleVariants, backgroundStyles, spinnerStyle, spinnerWrapperStyles } from "./style.css";

interface TableLoadingInterface {
  loading: boolean;
}

const appearanceAnimation: AppearanceAnimation = {
  from: appearanceStyleVariants.from,
  to: appearanceStyleVariants.to,
  duration: 200,
  transitionProperties: ["opacity", "visibility"],
};

function TableLoading({ loading }: TableLoadingInterface) {
  const [{ animationStyle, animationClassName }, render] = useAppearanceAnimation(loading, appearanceAnimation);
  if (!render) return null;

  return (
    <>
      <div style={animationStyle} className={cn(backgroundStyles, animationClassName)} />
      <div style={animationStyle} className={cn(spinnerWrapperStyles, animationClassName)}>
        <Spinner className={spinnerStyle} />
      </div>
    </>
  );
}

export default React.memo(TableLoading);
