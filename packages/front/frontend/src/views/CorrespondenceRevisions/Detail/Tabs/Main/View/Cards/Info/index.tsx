import React from "react";
import { observer } from "mobx-react-lite";
import { useTranslation, useViewContext } from "@app/front-kit";
import { DateMode } from "@worksolutions/utils";

import Card from "components/Card";
import GroupedContent from "components/FormField/GroupedContent";
import FormFieldUser from "components/FormField/User";
import FormFieldDate from "components/FormField/Date";
import FormFieldAttachments from "components/FormField/Attachments";

import { CorrespondenceRevisionsStorage } from "core/storages/correspondence/revisions";

function InfoCard() {
  const { t } = useTranslation("correspondence-revision-detail");
  const revision = useViewContext().containerInstance.get(CorrespondenceRevisionsStorage).revisionDetail!;

  return (
    <Card>
      <GroupedContent>
        <FormFieldUser
          title={t({ scope: "main_tab", place: "author_field", name: "placeholder" })}
          value={revision.author}
        />
        <FormFieldDate
          view
          title={t({ scope: "main_tab", place: "created_at_field", name: "placeholder" })}
          value={revision.createdAt}
          dateMode={DateMode.DATE_WITH_STRING_MONTH}
        />
        <FormFieldDate
          view
          title={t({ scope: "main_tab", place: "updated_at_field", name: "placeholder" })}
          value={revision.updatedAt}
          dateMode={DateMode.DATE_WITH_STRING_MONTH}
        />
        <FormFieldAttachments
          view
          title={t({ scope: "main_tab", place: "attachments_field", name: "placeholder" })}
          value={revision.files}
        />
      </GroupedContent>
    </Card>
  );
}

export default observer(InfoCard);
