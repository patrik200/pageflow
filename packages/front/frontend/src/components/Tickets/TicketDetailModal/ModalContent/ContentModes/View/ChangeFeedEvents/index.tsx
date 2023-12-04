import React from "react";
import { observer } from "mobx-react-lite";
import { useTranslation } from "@app/front-kit";
import { DictionaryTypes, TicketPriorities } from "@app/shared-enums";

import ChangeFeedEvent, {
  ChangeFeedEventUpdateRenderers,
  DateRenderer,
  DictionaryRenderer,
  EnumRenderer,
  FilesRenderer,
  TextRenderer,
  UserRenderer,
} from "components/ChangeFeed";

import { ChangeFeedEventEntity } from "core/entities/change-feed";

interface ChangeFeedEventsInterface {
  event: ChangeFeedEventEntity;
}

function ChangeFeedEvents({ event }: ChangeFeedEventsInterface) {
  const { t } = useTranslation("ticket-detail");

  const updateRenderers = React.useMemo<ChangeFeedEventUpdateRenderers>(
    () => ({
      name: [TextRenderer, { title: t({ scope: "main_tab", place: "name_field", name: "title" }) }],
      description: [
        TextRenderer,
        { title: t({ scope: "main_tab", place: "description_field", name: "title" }), options: { asHTML: true } },
      ],
      type: [
        DictionaryRenderer,
        {
          title: t({ scope: "main_tab", place: "type_field", name: "title" }),
          options: { dictionaryType: DictionaryTypes.TICKET_TYPE },
        },
      ],
      customer: [UserRenderer, { title: t({ scope: "main_tab", place: "customer_field", name: "title" }) }],
      responsible: [UserRenderer, { title: t({ scope: "main_tab", place: "responsible_field", name: "title" }) }],
      status: [
        DictionaryRenderer,
        {
          title: t({ scope: "main_tab", place: "status_field", name: "title" }),
          options: { dictionaryType: DictionaryTypes.TICKET_STATUS },
        },
      ],
      deadline: [DateRenderer, { title: t({ scope: "main_tab", place: "deadline_field", name: "title" }) }],
      priority: [
        EnumRenderer,
        {
          title: t({ scope: "main_tab", place: "priority_field", name: "title" }),
          options: {
            [TicketPriorities.LOW]: t({ scope: "common:kanban", place: "ticket_priorities", name: "low" }),
            [TicketPriorities.MEDIUM]: t({ scope: "common:kanban", place: "ticket_priorities", name: "medium" }),
            [TicketPriorities.HIGH]: t({ scope: "common:kanban", place: "ticket_priorities", name: "high" }),
          },
        },
      ],
      files: [FilesRenderer, { title: t({ scope: "main_tab", place: "files_field", name: "title" }) }],
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
