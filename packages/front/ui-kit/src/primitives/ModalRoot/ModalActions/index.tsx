import React from "react";
import cn from "classnames";

import { ButtonType } from "primitives/Button";

import ActionButton from "./ActionButton";
import { ModalActionsContext } from "./context";

import { wrapperStyles } from "./style.css";

export interface ModalActionsInterface {
  className?: string;
  primaryActionClassName?: string;
  secondaryActionClassName?: string;
  fitActionSizes?: boolean;
  primaryActionText?: string;
  secondaryActionText?: string;
  primaryActionVariant?: ButtonType;
  secondaryActionVariant?: ButtonType;
  primaryActionLoading?: boolean;
  secondaryActionLoading?: boolean;
  primaryActionDisabled?: boolean;
  secondaryActionDisabled?: boolean;
  closeOnSecondaryActionClick?: boolean;
  onPrimaryActionClick?: (close: () => void) => void;
  onSecondaryActionClick?: (close: () => void) => void;
}

function ModalActions(
  {
    className,
    primaryActionClassName,
    secondaryActionClassName,
    fitActionSizes,
    primaryActionLoading,
    secondaryActionLoading,
    primaryActionText,
    secondaryActionText,
    primaryActionDisabled,
    secondaryActionDisabled,
    primaryActionVariant = "PRIMARY",
    secondaryActionVariant = "OUTLINE",
    closeOnSecondaryActionClick = true,
    onPrimaryActionClick,
    onSecondaryActionClick,
  }: ModalActionsInterface,
  ref: React.Ref<HTMLDivElement>,
) {
  const { close } = React.useContext(ModalActionsContext);

  const primaryAction = primaryActionText ? (
    <ActionButton
      className={primaryActionClassName}
      fit={fitActionSizes}
      text={primaryActionText}
      type={primaryActionVariant}
      loading={primaryActionLoading}
      disabled={primaryActionDisabled}
      close={close}
      onClick={onPrimaryActionClick}
    />
  ) : undefined;

  const handleSecondaryActionClick = React.useCallback(
    (close: () => void) => {
      if (closeOnSecondaryActionClick) close();
      if (onSecondaryActionClick) onSecondaryActionClick(close);
    },
    [closeOnSecondaryActionClick, onSecondaryActionClick],
  );

  const secondaryAction = secondaryActionText ? (
    <ActionButton
      className={secondaryActionClassName}
      fit={fitActionSizes}
      text={secondaryActionText}
      type={secondaryActionVariant}
      loading={secondaryActionLoading}
      disabled={secondaryActionDisabled}
      close={close}
      onClick={handleSecondaryActionClick}
    />
  ) : undefined;

  return (
    <>
      {(primaryAction || secondaryAction) && (
        <div ref={ref} className={cn(className, wrapperStyles)}>
          {secondaryAction}
          {primaryAction}
        </div>
      )}
    </>
  );
}

export default React.memo(React.forwardRef(ModalActions));

export { ModalActionsContext } from "./context";
