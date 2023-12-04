import React from "react";
import { observer } from "mobx-react-lite";
import { DateTime } from "luxon";
import { useViewContext } from "@app/front-kit";
import { Typography } from "@app/ui-kit";
import cn from "classnames";
import { DateMode } from "@worksolutions/utils";

import UserRow from "components/UserRow";

import { UserEntity } from "core/entities/user";

import { IntlDateStorage } from "core/storages/intl-date";

import {
  actionsWrapperStyles,
  contentWrapperStyles,
  timesWrapperStyles,
  timeTextStyles,
  titleInfoStyles,
  titleWrapperStyles,
  wrapperStyles,
} from "./style.css";

interface CommentTemplateInterface {
  className?: string;
  author: UserEntity;
  createdAt: DateTime;
  actions?: React.ReactNode;
  bottomContent?: React.ReactNode;
  children: React.ReactNode;
}

function CommentTemplate({ className, author, createdAt, actions, bottomContent, children }: CommentTemplateInterface) {
  const { getIntlDate } = useViewContext().containerInstance.get(IntlDateStorage);
  const intlDate = React.useMemo(() => getIntlDate(), [getIntlDate]);

  return (
    <div className={cn(wrapperStyles, className)}>
      <div className={titleWrapperStyles}>
        <div className={titleInfoStyles}>
          <UserRow user={author} hidePosition />
          <div className={timesWrapperStyles}>
            <Typography className={timeTextStyles}>{intlDate.formatDate(createdAt, DateMode.DATE)}</Typography>
            <Typography className={timeTextStyles}>{intlDate.formatDate(createdAt, DateMode.TIME)}</Typography>
          </div>
        </div>
        {actions && <div className={actionsWrapperStyles}>{actions}</div>}
      </div>
      <div className={contentWrapperStyles}>{children}</div>
      {bottomContent}
    </div>
  );
}

export default observer(CommentTemplate);
