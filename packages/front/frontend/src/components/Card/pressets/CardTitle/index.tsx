import React from "react";
import { observer } from "mobx-react-lite";
import { Typography } from "@app/ui-kit";
import cn from "classnames";

import Divider from "components/Divider";
import Breadcrumbs, { BreadcrumbInterface } from "components/Breadcrumbs";

import Card from "../../index";

import {
  actionsWrapperStyles,
  breadcrumbsStyles,
  cardSizeStyleVariants,
  dividerStyles,
  titleContentStyles,
  titleSizeStyleVariants,
  titleWrapperStyles,
  topContentWrapperStyles,
} from "./style.css";

export interface CardTitlePresetInterface {
  className?: string;
  breadcrumbs?: BreadcrumbInterface[];
  preTitle?: React.ReactNode;
  title?: string;
  actions?: React.ReactNode;
  size?: "default" | "medium" | "small";
  children?: React.ReactNode;
}

function CardTitlePreset({
  className,
  breadcrumbs,
  preTitle,
  title,
  actions,
  size = "default",
  children,
}: CardTitlePresetInterface) {
  return (
    <Card className={cn(cardSizeStyleVariants[size], className)}>
      {(breadcrumbs || title || actions) && (
        <div className={topContentWrapperStyles}>
          <div className={titleWrapperStyles}>
            {breadcrumbs && <Breadcrumbs className={breadcrumbsStyles} items={breadcrumbs} />}
            <div className={titleContentStyles}>
              {preTitle}
              {title && <Typography className={titleSizeStyleVariants[size]}>{title}</Typography>}
            </div>
          </div>
          {actions && <div className={actionsWrapperStyles}>{actions}</div>}
        </div>
      )}
      {children && title && <Divider className={dividerStyles} />}
      {children}
    </Card>
  );
}

export default observer(CardTitlePreset);
