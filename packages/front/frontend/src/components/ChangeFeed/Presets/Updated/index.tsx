import React from "react";
import { observer } from "mobx-react-lite";
import { Icon, Typography } from "@app/ui-kit";

import { ChangeFeedEventEntity } from "core/entities/change-feed";

import {
  rowItemsWrapperSeparatorIconStyles,
  rowItemsWrapperStyles,
  rowsWrapperStyles,
  rowTitleStyles,
  rowWrapperStyles,
} from "./style.css";

export type ChangeFeedEventUpdatedRenderer = [
  React.FC<{ value: any; options: object; mode: "from" | "to" }>,
  { title: string; options?: object },
];

export type ChangeFeedEventUpdateRenderers = Record<string, ChangeFeedEventUpdatedRenderer>;

interface ChangeFeedEventUpdatedInterface {
  event: ChangeFeedEventEntity;
  renderers: ChangeFeedEventUpdateRenderers;
}

function ChangeFeedEventUpdated({ event, renderers = {} }: ChangeFeedEventUpdatedInterface) {
  const eventDataMap = React.useMemo(() => new Map(Object.entries(event.data)), [event.data]);

  return (
    <div className={rowsWrapperStyles}>
      {Object.entries(renderers).map(([rendererKey, renderer]) => {
        const event = eventDataMap.get(rendererKey);
        if (!event) return null;
        const [Renderer, { title, options: rendererOptions }] = renderer;

        return (
          <div key={rendererKey} className={rowWrapperStyles}>
            <Typography className={rowTitleStyles}>{title}</Typography>
            <div className={rowItemsWrapperStyles}>
              <Renderer value={event.from} options={rendererOptions!} mode="from" />
              {!(Renderer as any).hideSeparator && (
                <Icon className={rowItemsWrapperSeparatorIconStyles} icon="arrowRightSLine" />
              )}
              <Renderer value={event.to} options={rendererOptions!} mode="to" />
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default observer(ChangeFeedEventUpdated);
