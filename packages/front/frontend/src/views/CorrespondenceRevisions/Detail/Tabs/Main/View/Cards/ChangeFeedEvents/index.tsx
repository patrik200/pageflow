import React from "react";
import { observer } from "mobx-react-lite";
import { useTranslation } from "@app/front-kit";

import ChangeFeedEvent, { ChangeFeedEventUpdateRenderers, FilesRenderer, TextRenderer } from "components/ChangeFeed";

import { ChangeFeedEventEntity } from "core/entities/change-feed";

interface ChangeFeedEventsInterface {
  event: ChangeFeedEventEntity;
}

function ChangeFeedEvents({ event }: ChangeFeedEventsInterface) {
  const { t } = useTranslation("correspondence-revision-detail");

  const updateRenderers = React.useMemo<ChangeFeedEventUpdateRenderers>(
    () => ({
      name: [TextRenderer, { title: t({ scope: "main_tab", place: "number_field", name: "placeholder" }) }],
      files: [FilesRenderer, { title: t({ scope: "main_tab", place: "attachments_field", name: "placeholder" }) }],
    }),
    [t],
  );

  return (
    <ChangeFeedEvent
      event={event}
      createdTitle={t({ scope: "change_feed_events", place: "created", name: "title" })}
      updateRenders={updateRenderers}
    />
  );
}

export default observer(ChangeFeedEvents);
