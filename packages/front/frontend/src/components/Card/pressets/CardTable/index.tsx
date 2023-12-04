import React from "react";
import { observer } from "mobx-react-lite";
import cn from "classnames";
import { Spinner, Typography } from "@app/ui-kit";

import Breadcrumbs, { BreadcrumbInterface } from "components/Breadcrumbs";

import Card from "../../index";

import {
  actionsWrapperStyles,
  breadcrumbsStyles,
  cardStyles,
  contentStyles,
  preContentStyles,
  titleSpinnerStyles,
  titleStyles,
  titleWrapperStyles,
} from "./style.css";

interface CardTablePresetInterface {
  className?: string;
  contentClassName?: string;
  loading?: boolean;
  title?: string;
  breadcrumbs?: BreadcrumbInterface[];
  secondaryActions?: React.ReactNode;
  actions?: React.ReactNode;
  children: React.ReactNode;
}

function CardTablePreset({
  className,
  contentClassName,
  loading,
  title,
  breadcrumbs,
  secondaryActions,
  actions,
  children,
}: CardTablePresetInterface) {
  return (
    <Card className={cn(className, cardStyles)}>
      {breadcrumbs ? (
        <>
          <div className={titleWrapperStyles}>
            {title && <Typography className={titleStyles}>{title}</Typography>}
            {loading && <Spinner className={titleSpinnerStyles} />}
          </div>
          <div className={preContentStyles}>
            <Breadcrumbs className={breadcrumbsStyles} items={breadcrumbs} />
            {actions && <div className={actionsWrapperStyles}>{actions}</div>}
          </div>
        </>
      ) : (
        <div className={preContentStyles}>
          {!secondaryActions && (
            <div className={titleWrapperStyles}>
              {title && <Typography className={titleStyles}>{title}</Typography>}
              {loading && <Spinner className={titleSpinnerStyles} />}
            </div>
          )}
          {secondaryActions}
          {actions && <div className={actionsWrapperStyles}>{actions}</div>}
        </div>
      )}
      <div className={cn(contentStyles, contentClassName)}>{children}</div>
    </Card>
  );
}

export default observer(CardTablePreset);
