import React from "react";
import ReactDOM from "react-dom";
import cn from "classnames";
import { stopPropagationHandler } from "@worksolutions/react-utils";
import { rootNamespaceClassName } from "styles";

import {
  ModalContext,
  RenderedInModalContext,
  RenderedInModalContextActiveValue,
  RenderInModalContextProvider,
} from "primitives/ModalInternal";

import { AppearanceAnimation, useAppearanceAnimation } from "hooks";

import { modalRootStyles } from "./style.css";

export interface ModalRootInterface {
  className?: string;
  opened: boolean;
  children: React.ReactNode;
  appearanceAnimation: AppearanceAnimation;
}

function ModalRoot(
  { className, children, opened, appearanceAnimation }: ModalRootInterface,
  ref: React.Ref<HTMLDivElement>,
) {
  const [animationProps, visible] = useAppearanceAnimation(opened, appearanceAnimation);

  const root = React.useContext(ModalContext).rootElement;

  if (!root || !visible) return null;

  return ReactDOM.createPortal(
    <RenderInModalContextProvider>
      <ModalRootContent>
        <div
          ref={ref}
          style={animationProps.animationStyle}
          className={cn(modalRootStyles, className, animationProps.animationClassName)}
          onClick={stopPropagationHandler as any}
        >
          {children}
        </div>
      </ModalRootContent>
    </RenderInModalContextProvider>,
    root,
  );
}

export default React.memo(React.forwardRef(ModalRoot));

function ModalRootContent({ children }: { children: React.JSX.Element }) {
  const { openedPath } = React.useContext(RenderedInModalContext) as RenderedInModalContextActiveValue;
  const levelRef = React.useRef(openedPath.length);

  return React.cloneElement(children, {
    className: cn(children.props.className, `${rootNamespaceClassName}-modal-root-${levelRef.current}`),
  });
}

export { default as ModalActions } from "./ModalActions";
export type { ModalActionsInterface } from "./ModalActions";
