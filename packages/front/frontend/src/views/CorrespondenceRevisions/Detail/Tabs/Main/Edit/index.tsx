import React from "react";
import { observer } from "mobx-react-lite";
import { useTranslation } from "@app/front-kit";

import Card from "components/Card";
import GroupedContent from "components/FormField/GroupedContent";
import FormFieldText from "components/FormField/Text";
import FormFieldAttachments from "components/FormField/Attachments";

import { EditCorrespondenceRevisionEntity } from "core/storages/correspondence/entities/revision/EditCorrespondenceRevision";

import { wrapperStyles } from "../View/style.css";

interface RevisionDetailMainEditInterface {
  loading: boolean;
  entity: EditCorrespondenceRevisionEntity;
}

function RevisionDetailMainEdit({ loading, entity }: RevisionDetailMainEditInterface) {
  const { t } = useTranslation("correspondence-revision-detail");
  return (
    <div className={wrapperStyles}>
      <Card>
        <GroupedContent>
          <FormFieldText
            edit
            required
            disabled={loading}
            title={t({ scope: "main_tab", place: "number_field", name: "placeholder" })}
            value={entity.number}
            errorMessage={entity.viewErrors.number}
            onChange={entity.setNumber}
          />
          <FormFieldAttachments
            edit
            disabled={loading}
            title={t({ scope: "main_tab", place: "attachments_field", name: "placeholder" })}
            value={entity.attachments}
            onAdd={entity.addAttachments}
            onDelete={entity.deleteAttachmentByIndex}
          />
        </GroupedContent>
      </Card>
    </div>
  );
}

export default observer(RevisionDetailMainEdit);
