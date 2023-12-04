import React from "react";
import { observer } from "mobx-react-lite";
import { useTranslation } from "@app/front-kit";
import { DocumentRevisionStatus } from "@app/shared-enums";

import ChangeFeedEvent, {
  BooleanRenderer,
  ChangeFeedEventUpdateRenderers,
  DateRenderer,
  EnumRenderer,
  FilesRenderer,
  TextRenderer,
} from "components/ChangeFeed";

import { ChangeFeedEventEntity } from "core/entities/change-feed";

import ResponsibleUserRenderer from "./Renderers/ResponsibleUser";
import ResponsibleUserFlowRenderer from "./Renderers/ResponsibleUserFlow";

interface ChangeFeedEventsInterface {
  event: ChangeFeedEventEntity;
}

function ChangeFeedEvents({ event }: ChangeFeedEventsInterface) {
  const { t } = useTranslation("document-revision-detail");

  const updateRenderers = React.useMemo<ChangeFeedEventUpdateRenderers>(
    () => ({
      name: [TextRenderer, { title: t({ scope: "main_tab", place: "number_field", name: "placeholder" }) }],
      approvingDeadline: [
        DateRenderer,
        { title: t({ scope: "main_tab", place: "approving_deadline_field", name: "placeholder" }) },
      ],
      canProlongApprovingDeadline: [
        BooleanRenderer,
        {
          title: t({ scope: "main_tab", place: "can_prolong_approving_deadline_field", name: "placeholder" }),
          options: {
            true: t({
              scope: "main_tab",
              place: "can_prolong_approving_deadline_field",
              name: "values",
              parameter: "yes",
            }),
            false: t({
              scope: "main_tab",
              place: "can_prolong_approving_deadline_field",
              name: "values",
              parameter: "no",
            }),
          },
        },
      ],
      files: [FilesRenderer, { title: t({ scope: "main_tab", place: "attachments_field", name: "placeholder" }) }],
      status: [
        EnumRenderer,
        {
          title: t({ scope: "main_tab", place: "status_field", name: "placeholder" }),
          options: {
            [DocumentRevisionStatus.INITIAL]: t({ scope: "common:document_revision_statuses", name: "initial" }),
            [DocumentRevisionStatus.REVIEW]: t({ scope: "common:document_revision_statuses", name: "review" }),
            [DocumentRevisionStatus.RETURNED]: t({ scope: "common:document_revision_statuses", name: "returned" }),
            [DocumentRevisionStatus.APPROVED]: t({ scope: "common:document_revision_statuses", name: "approved" }),
            [DocumentRevisionStatus.APPROVED_WITH_COMMENT]: t({
              scope: "common:document_revision_statuses",
              name: "approved_with_comment",
            }),
            [DocumentRevisionStatus.REVOKED]: t({ scope: "common:document_revision_statuses", name: "revoked" }),
            [DocumentRevisionStatus.ARCHIVE]: t({ scope: "common:document_revision_statuses", name: "archive" }),
            [DocumentRevisionStatus.ARCHIVED_AUTOMATICALLY_RESTORE_INITIAL]: t({
              scope: "common:document_revision_statuses",
              name: "archived_automatically_restore_initial",
            }),
            [DocumentRevisionStatus.ARCHIVED_AUTOMATICALLY_RESTORE_ARCHIVE]: t({
              scope: "common:document_revision_statuses",
              name: "archived_automatically_restore_archive",
            }),
          },
        },
      ],
      returnMessage: [
        TextRenderer,
        { title: t({ scope: "main_tab", place: "return_message_field", name: "placeholder" }) },
      ],
      responsibleUserApproving: [
        ResponsibleUserRenderer,
        {
          title: t({ scope: "main_tab", place: "responsible_user_field", name: "placeholder" }),
        },
      ],
      responsibleUserFlowApproving: [
        ResponsibleUserFlowRenderer,
        {
          title: t({ scope: "main_tab", place: "responsible_user_flow_field", name: "placeholder" }),
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
