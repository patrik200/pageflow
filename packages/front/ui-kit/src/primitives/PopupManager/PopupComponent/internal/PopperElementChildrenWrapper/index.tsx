import React, { Ref, useEffect } from "react";
import { stopPropagationHandler, useProvideRef } from "@worksolutions/react-utils";
import cn from "classnames";

import { popperElementChildrenWrapperStyle } from "./style.css";

interface PopperChildrenProps {
  className?: string;
  style?: Record<string, any>;
  children: JSX.Element;
  triggerElement: HTMLElement | null;
  stopPropagation?: boolean;
  update?: () => void;
  recalculatePopupWidth: () => void;
}

function PopperElementChildrenWrapper(
  {
    style,
    className,
    children,
    triggerElement,
    stopPropagation: stopPropagationProp = true,
    update,
    recalculatePopupWidth,
    ...props
  }: PopperChildrenProps,
  ref: Ref<HTMLDivElement>,
) {
  const [htmlElement, setHtmlElement] = React.useState<HTMLElement>();

  useEffect(() => {
    if (!triggerElement || !update || !htmlElement) return;
    const resizeObserver = new ResizeObserver(() => {
      recalculatePopupWidth();
      update();
    });
    resizeObserver.observe(triggerElement);
    resizeObserver.observe(htmlElement);
    return () => resizeObserver.disconnect();
  }, [htmlElement, recalculatePopupWidth, triggerElement, update]);

  const { style: childrenStyle, className: childrenClassName, onClick: childrenOnClick } = children.props;

  const resultStyle = React.useMemo(() => Object.assign({}, childrenStyle, style), [childrenStyle, style]);

  const handleClick = React.useCallback(
    (event: React.SyntheticEvent<HTMLElement, MouseEvent>) => {
      childrenOnClick?.(event);
      if (stopPropagationProp) stopPropagationHandler(event);
    },
    [childrenOnClick, stopPropagationProp],
  );

  return React.cloneElement(children, {
    ...props,
    ...children.props,
    style: resultStyle,
    className: cn(className, popperElementChildrenWrapperStyle, childrenClassName),
    ref: useProvideRef(ref, setHtmlElement, (children as any).ref),
    onClick: handleClick,
  });
}

export default React.memo(React.forwardRef(PopperElementChildrenWrapper));
