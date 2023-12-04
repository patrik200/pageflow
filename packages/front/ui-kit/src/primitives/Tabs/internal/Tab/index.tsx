import React from "react";
import { assignInlineVars } from "@vanilla-extract/dynamic";
import cn from "classnames";

import Typography from "primitives/Typography";

import { tabSizes } from "./config";

import { commonButtonStyles, horizontalPaddingVar, textStyles, textActive, verticalPaddingVar } from "./style.css";

export interface TabItemInterface<CODE extends string = string> {
  title: string;
  code: CODE;
  element?: React.JSX.Element;
}

function Tab<T extends string = string>({
  title,
  emitChangeEventOnUnchangedValue,
  isActive,
  onClick,
}: Omit<TabItemInterface<T>, "element"> & {
  emitChangeEventOnUnchangedValue?: boolean;
  isActive: boolean;
  onClick: () => void;
}) {
  const styles = React.useMemo(
    () =>
      assignInlineVars({
        [horizontalPaddingVar]: tabSizes.px + "px",
        [verticalPaddingVar]: tabSizes.py + "px",
      }),
    [],
  );

  return (
    <button
      style={styles}
      className={commonButtonStyles}
      disabled={isActive && !emitChangeEventOnUnchangedValue}
      onClick={onClick}
    >
      <Typography className={cn(textStyles, isActive && textActive)}>{title}</Typography>
    </button>
  );
}

export default React.memo(Tab);
