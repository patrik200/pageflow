import React from "react";
import { observer } from "mobx-react-lite";
import { useTranslation } from "@app/front-kit";
import { ProjectsStatus } from "@app/shared-enums";

import ChangeFeedEvent, {
  BooleanRenderer,
  ChangeFeedEventUpdateRenderers,
  DateRenderer,
  EnumRenderer,
  PermissionRenderer,
  TextRenderer,
  UserRenderer,
} from "components/ChangeFeed";

import { ChangeFeedEventEntity } from "core/entities/change-feed";

interface ChangeFeedEventsInterface {
  event: ChangeFeedEventEntity;
}

function ChangeFeedEvents({ event }: ChangeFeedEventsInterface) {
  const { t } = useTranslation("project-detail");

  const updateRenderers = React.useMemo<ChangeFeedEventUpdateRenderers>(
    () => ({
      name: [TextRenderer, { title: t({ scope: "main_tab", place: "name_field", name: "placeholder" }) }],
      description: [TextRenderer, { title: t({ scope: "main_tab", place: "description_field", name: "placeholder" }) }],
      startDatePlan: [
        DateRenderer,
        {
          title: `\
${t({ scope: "main_tab", place: "date_plan_field", name: "placeholder" })}\n\
${t({ scope: "main_tab", place: "date_plan_field", name: "from_placeholder" })}`,
        },
      ],
      endDatePlan: [
        DateRenderer,
        {
          title: `\
${t({ scope: "main_tab", place: "date_plan_field", name: "placeholder" })}\n\
${t({ scope: "main_tab", place: "date_plan_field", name: "to_placeholder" })}`,
        },
      ],
      startDateForecast: [
        DateRenderer,
        {
          title: `\
${t({ scope: "main_tab", place: "date_forecast_field", name: "placeholder" })}\n\
${t({ scope: "main_tab", place: "date_forecast_field", name: "from_placeholder" })}`,
        },
      ],
      endDateForecast: [
        DateRenderer,
        {
          title: `\
${t({ scope: "main_tab", place: "date_forecast_field", name: "placeholder" })}\n\
${t({ scope: "main_tab", place: "date_forecast_field", name: "to_placeholder" })}`,
        },
      ],
      startDateFact: [
        DateRenderer,
        {
          title: `\
${t({ scope: "main_tab", place: "date_fact_field", name: "placeholder" })}\n\
${t({ scope: "main_tab", place: "date_fact_field", name: "from_placeholder" })}`,
        },
      ],
      endDateFact: [
        DateRenderer,
        {
          title: `\
${t({ scope: "main_tab", place: "date_fact_field", name: "placeholder" })}\n\
${t({ scope: "main_tab", place: "date_fact_field", name: "to_placeholder" })}`,
        },
      ],
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
      responsible: [
        UserRenderer,
        {
          title: t({ scope: "main_tab", place: "responsible_field", name: "title" }),
        },
      ],
      notifyInDays: [TextRenderer, { title: t({ scope: "main_tab", place: "notify_in_field", name: "placeholder" }) }],
      status: [
        EnumRenderer,
        {
          title: t({ scope: "main_tab", place: "status_field", name: "title" }),
          options: {
            [ProjectsStatus.IN_PROGRESS]: t({
              scope: "main_tab",
              place: "status_field",
              name: "statuses",
              parameter: "in_progress",
            }),
            [ProjectsStatus.COMPLETED]: t({
              scope: "main_tab",
              place: "status_field",
              name: "statuses",
              parameter: "completed",
            }),
            [ProjectsStatus.ARCHIVE]: t({
              scope: "main_tab",
              place: "status_field",
              name: "statuses",
              parameter: "archive",
            }),
          },
        },
      ],
      preview: [TextRenderer, { title: t({ scope: "main_tab", place: "preview_field", name: "placeholder" }) }],
      permissions: [PermissionRenderer, { title: t({ scope: "main_tab", place: "members_field", name: "title" }) }],
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
