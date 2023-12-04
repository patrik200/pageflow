import React from "react";
import cn from "classnames";
import { asyncTimeout } from "@worksolutions/utils";
import { provideRef } from "@worksolutions/react-utils";

import Typography from "primitives/Typography";

import { getVariableNameFromCssVarFunction } from "utils";

import { InputSize } from "../../../types";

import {
  detectorLeftVar,
  focusedDefaultTextStyles,
  focusedMaterialTextLeftStyleVariants,
  focusedMaterialTextStyles,
  informerStyles,
  requiredAsteriskStyle,
  textAnimationStyles,
  textSizeStyleVariants,
  textStyles,
} from "./style.css";

export interface InputFieldVirtualPlaceholderInterface {
  focused: boolean;
  hasText: boolean;
  placeholder: string | undefined;
  materialPlaceholder?: boolean;
  required?: boolean;
  forceShowAsterisk?: boolean;
  informer?: React.JSX.Element;
  size?: InputSize;
  onClick?: () => void;
}

function InputFieldVirtualPlaceholder({
  focused,
  hasText,
  placeholder,
  materialPlaceholder,
  required,
  forceShowAsterisk,
  informer,
  size = "default",
  onClick,
}: InputFieldVirtualPlaceholderInterface) {
  const initTextRef = React.useCallback(
    (ref: HTMLSpanElement | null) => {
      if (!ref || !materialPlaceholder) return;
      subscribeOnDetectingLeftVar(ref);
    },
    [materialPlaceholder],
  );

  const initInformerRef = React.useCallback(
    (ref: HTMLDivElement | null) => {
      if (!ref) return;
      provideRef((informer! as any).ref, subscribeOnDetectingLeftVar)(ref);
    },
    [informer],
  );

  return (
    <>
      {informer &&
        React.cloneElement(informer, {
          ref: initInformerRef,
          className: cn(informer.props.className, informerStyles),
        })}
      <Typography
        ref={initTextRef}
        className={cn(
          textStyles,
          textSizeStyleVariants[size],
          textAnimationStyles,
          materialPlaceholder
            ? focused || hasText
              ? [
                  focusedMaterialTextStyles,
                  focusedMaterialTextLeftStyleVariants[informer ? "withInformer" : "withoutInformer"],
                ]
              : undefined
            : hasText
            ? focusedDefaultTextStyles
            : undefined,
        )}
        onClick={onClick}
      >
        {placeholder || ""}
        {(forceShowAsterisk || required) && <span className={requiredAsteriskStyle}>*</span>}
      </Typography>
    </>
  );
}

export default React.memo(InputFieldVirtualPlaceholder);

function subscribeOnDetectingLeftVar(element: HTMLElement) {
  const root = element.parentElement!;
  const getHasText = () => root.getAttribute("data-has-text") === "true";

  let originalHasText = getHasText();

  const observer = new ResizeObserver(async function () {
    const variable = getVariableNameFromCssVarFunction(detectorLeftVar);
    await asyncTimeout(10);
    const newHasText = getHasText();
    if (originalHasText !== newHasText) {
      originalHasText = newHasText;
    } else {
      element.classList.remove(textAnimationStyles);
      setTimeout(() => element.classList.add(textAnimationStyles), 50);
    }

    element.style.setProperty(variable, `-${root.offsetLeft}px`);
  });

  observer.observe(root);
}
