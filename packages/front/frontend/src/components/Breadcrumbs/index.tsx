import React, { Fragment } from "react";
import { observer } from "mobx-react-lite";
import cn from "classnames";
import { Icon, Typography } from "@app/ui-kit";

import {
  iconStyles,
  itemActiveStyles,
  itemDisabledStyles,
  itemStyles,
  wrapperDisabledStyles,
  wrapperStyles,
} from "./style.css";

export interface BreadcrumbInterface {
  text: string;
  onClick: () => void;
}

interface BreadcrumbsInterface {
  className?: string;
  items: BreadcrumbInterface[];
  disabled?: boolean;
}

function Breadcrumbs({ className, items, disabled }: BreadcrumbsInterface) {
  const lastIndex = items.length - 1;

  return (
    <div className={cn(className, wrapperStyles, disabled && wrapperDisabledStyles)}>
      {items.map(({ text, onClick }, key) => (
        <Fragment key={key}>
          <Typography
            className={cn(itemStyles, disabled && itemDisabledStyles, key === lastIndex && itemActiveStyles)}
            onClick={disabled ? undefined : onClick}
          >
            {text}
          </Typography>
          {key !== lastIndex && <Icon className={iconStyles} icon="arrowRightSLine" />}
        </Fragment>
      ))}
    </div>
  );
}

export default observer(Breadcrumbs);
