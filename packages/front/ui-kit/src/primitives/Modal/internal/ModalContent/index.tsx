import React from "react";
import cn from "classnames";

import Scroll from "primitives/Scroll";
import { ModalActionsContext } from "primitives/ModalRoot/ModalActions";
import type { ScrollProviderContextInterface } from "primitives/ScrollProvider";
import { useModalSmartCloser } from "primitives/ModalInternal";
import HandleClickOutside from "primitives/HandleClickOutside";

import { ComponentWithRef } from "types/ComponentWithRef";

import ModalCloseButton from "../ModalCloseButton";
import { ModalInterface } from "../../types";

import { modalContentStyle, scrollChildrenWrapperStyles, scrollStyles } from "./style.css";

interface ModalContentInterface
  extends Pick<
    ModalInterface,
    "className" | "outerClassName" | "renderCloseButton" | "beforeContent" | "afterContent" | "closeOnClickOutside"
  > {
  children: React.ReactNode;
  modalRoot: HTMLElement | null;
  close: () => void;
}

function ModalContent(
  {
    className,
    outerClassName,
    children,
    renderCloseButton = true,
    beforeContent,
    afterContent,
    modalRoot,
    closeOnClickOutside,
    close,
  }: ModalContentInterface,
  ref: React.Ref<ScrollProviderContextInterface>,
) {
  const { clickOutsideIgnorePath, clickOutsideEnabled, onClickOutside } = useModalSmartCloser(modalRoot, close, {
    closeOnClickOutside,
  });
  const modalActionsProviderValue = React.useMemo(() => ({ close }), [close]);

  return (
    <HandleClickOutside
      enabled={clickOutsideEnabled}
      ignoreElements={clickOutsideIgnorePath}
      onClickOutside={onClickOutside}
    >
      <div className={cn(modalContentStyle, outerClassName)}>
        {beforeContent}
        {renderCloseButton && <ModalCloseButton onClick={close} />}
        <Scroll className={scrollStyles} scrollProviderRef={ref}>
          <ModalActionsContext.Provider value={modalActionsProviderValue}>
            <div className={cn(className, scrollChildrenWrapperStyles)}>{children}</div>
          </ModalActionsContext.Provider>
        </Scroll>
        {afterContent}
      </div>
    </HandleClickOutside>
  );
}

export default React.memo(React.forwardRef(ModalContent)) as ComponentWithRef<
  ModalContentInterface,
  ScrollProviderContextInterface
>;
