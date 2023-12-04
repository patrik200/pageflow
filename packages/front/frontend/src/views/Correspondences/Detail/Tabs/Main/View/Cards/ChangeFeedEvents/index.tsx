import React from "react";
import { observer } from "mobx-react-lite";
import { useTranslation } from "@app/front-kit";
import { CorrespondenceStatus } from "@app/shared-enums";

import ChangeFeedEvent, {
  BooleanRenderer,
  ChangeFeedEventUpdateRenderers,
  EnumRenderer,
  PermissionRenderer,
  TextRenderer,
} from "components/ChangeFeed";

import { ChangeFeedEventEntity } from "core/entities/change-feed";

interface ChangeFeedEventsInterface {
  event: ChangeFeedEventEntity;
}

function ChangeFeedEvents({ event }: ChangeFeedEventsInterface) {
  const { t } = useTranslation("correspondence-detail");

  const updateRenderers = React.useMemo<ChangeFeedEventUpdateRenderers>(
    () => ({
      name: [TextRenderer, { title: t({ scope: "main_tab", place: "name_field", name: "placeholder" }) }],
      description: [TextRenderer, { title: t({ scope: "main_tab", place: "description_field", name: "placeholder" }) }],
      isPrivate: [
        BooleanRenderer,
        {
          title: t({ scope: "main_tab", place: "private_field", name: "placeholder" }),
          options: {
            true: t({ scope: "main_tab", place: "private_field", name: "changes_feed", parameter: "private" }),
            false: t({ scope: "main_tab", place: "private_field", name: "changes_feed", parameter: "public" }),
          },
        },
      ],
      status: [
        EnumRenderer,
        {
          title: t({ scope: "main_tab", place: "status_field", name: "title" }),
          options: {
            [CorrespondenceStatus.ACTIVE]: t({
              scope: "main_tab",
              place: "status_field",
              name: "changes_feed",
              parameter: "active",
            }),
            [CorrespondenceStatus.ARCHIVE]: t({
              scope: "main_tab",
              place: "status_field",
              name: "changes_feed",
              parameter: "archived",
            }),
          },
        },
      ],
      permissions: [
        PermissionRenderer,
        {
          title: t({ scope: "main_tab", place: "members_field", name: "title" }),
        },
      ],
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
