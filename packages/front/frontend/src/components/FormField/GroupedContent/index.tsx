import React from "react";
import { observer } from "mobx-react-lite";
import { Typography } from "@app/ui-kit";
import cn from "classnames";

import {
  contentWrapperStyles,
  titleStyles,
  titleWrapperStyles,
  wrapperSizeStyleVariants,
  wrapperStyles,
} from "./style.css";

interface GroupedContentInterface {
  className?: string;
  title?: string;
  actions?: React.ReactNode;
  size?: keyof typeof wrapperSizeStyleVariants;
  children: React.ReactNode;
}

function GroupedContent({ className, title, actions, size = "default", children }: GroupedContentInterface) {
  return (
    <div className={cn(className, wrapperStyles, wrapperSizeStyleVariants[size])}>
      {(title || actions) && (
        <div className={titleWrapperStyles}>
          {title ? <Typography className={titleStyles}>{title}</Typography> : <div />}
          {actions}
        </div>
      )}
      <div className={contentWrapperStyles}>{children}</div>
    </div>
  );
}

export default observer(GroupedContent);
