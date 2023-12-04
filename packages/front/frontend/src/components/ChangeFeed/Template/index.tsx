import React from "react";
import { observer } from "mobx-react-lite";
import { useViewContext } from "@app/front-kit";
import { DateMode } from "@worksolutions/utils";
import { DateTime } from "luxon";
import { Typography } from "@app/ui-kit";

import { ChangeFeedEventEntity } from "core/entities/change-feed";

import { IntlDateStorage } from "core/storages/intl-date";

import UserRow from "../../UserRow";

import { contentStyles, createdTimeStyles, topWrapperStyles, wrapperStyles } from "./style.css";

interface ChangeFeedEventTemplateInterface {
  event: ChangeFeedEventEntity;
  children: React.ReactNode;
}

function ChangeFeedEventTemplate({ event, children }: ChangeFeedEventTemplateInterface) {
  const { getIntlDate } = useViewContext().containerInstance.get(IntlDateStorage);
  const createdAt = React.useMemo(
    () => getIntlDate().formatDate(DateTime.fromJSDate(event.createdAt), DateMode.DATE_TIME_WITH_STRING_MONTH),
    [event.createdAt, getIntlDate],
  );

  return (
    <div className={wrapperStyles}>
      <div className={topWrapperStyles}>
        <UserRow user={event.author} />
        <Typography className={createdTimeStyles}>{createdAt}</Typography>
      </div>
      <div className={contentStyles}>{children}</div>
    </div>
  );
}

export default observer(ChangeFeedEventTemplate);
