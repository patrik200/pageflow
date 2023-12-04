import React from "react";
import { observer } from "mobx-react-lite";
import { Typography } from "@app/ui-kit";
import { isString } from "@worksolutions/utils";

import { ChangeFeedEventEntity } from "core/entities/change-feed";

import { nameStyles, titleStyles } from "./style.css";

interface ChangeFeedEventCreatedInterface {
  title: string;
  event: ChangeFeedEventEntity;
}

function ChangeFeedEventCreated({ title, event }: ChangeFeedEventCreatedInterface) {
  return (
    <div>
      <Typography className={titleStyles}>{title}</Typography>
      {isString(event.data.name) && <Typography className={nameStyles}>{event.data.name}</Typography>}
    </div>
  );
}

export default observer(ChangeFeedEventCreated);
