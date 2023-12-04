import React from "react";
import cn from "classnames";

import { IconOrElement, IconOrElementType } from "primitives/Icon";

import { InputSize } from "../../../types";

import { itemSizeStyleVariants, itemStyles, itemStyleDefaultVariants, itemStyleSmallVariants } from "./style.css";

interface FieldItemInterface {
  children: IconOrElementType;
  position: keyof typeof itemStyleDefaultVariants;
  size: InputSize | undefined;
}

function FieldItem({ children, position, size = "default" }: FieldItemInterface) {
  return (
    <div
      className={cn(
        itemStyles,
        size === "default" ? itemStyleDefaultVariants[position] : itemStyleSmallVariants[position],
        itemSizeStyleVariants[size],
      )}
    >
      <IconOrElement icon={children} />
    </div>
  );
}

export default React.memo(FieldItem);
