import React from "react";
import cn from "classnames";

import Typography from "primitives/Typography";
import { IconOrElement, IconOrElementType } from "primitives/Icon";

import ListItemWrapper, { ListItemWrapperInterface } from "../ListItemWrapper";

import {
  layoutWrapperStyles,
  leftLayoutWrapperStyles,
  rightLayoutWrapperStyles,
  mainTextNoWrapStyles,
  mainTextStyles,
  secondaryTextStyles,
  selectableListItemWrapperStyle,
  textsWrapperStyles,
} from "./style.css";

export type ListItemInterface = Omit<ListItemWrapperInterface, "children"> & {
  leftLayout?: IconOrElementType;
  rightLayout?: IconOrElementType;
  selectable?: boolean;
  mainLayout: string;
  mainLayoutNoWrap?: boolean;
  secondaryLayout?: string;
};

function ListItem({
  className,
  leftLayout,
  rightLayout,
  selectable,
  mainLayout,
  mainLayoutNoWrap,
  secondaryLayout,
  ...props
}: ListItemInterface) {
  const layoutChild = (
    <div className={layoutWrapperStyles}>
      {leftLayout && (
        <div className={leftLayoutWrapperStyles}>
          <IconOrElement icon={leftLayout} />
        </div>
      )}
      <div className={textsWrapperStyles}>
        <Typography className={cn(mainTextStyles, mainLayoutNoWrap && mainTextNoWrapStyles)}>{mainLayout}</Typography>
        {secondaryLayout && <Typography className={secondaryTextStyles}>{secondaryLayout}</Typography>}
      </div>
      {rightLayout && (
        <div className={rightLayoutWrapperStyles}>
          <IconOrElement icon={rightLayout} />
        </div>
      )}
    </div>
  );

  if (selectable)
    return (
      <ListItemWrapper {...props} className={cn(className, selectableListItemWrapperStyle)}>
        {layoutChild}
      </ListItemWrapper>
    );

  return (
    <ListItemWrapper {...props} className={className}>
      {layoutChild}
    </ListItemWrapper>
  );
}

export default React.memo(ListItem);
