import React from "react";
import { observer } from "mobx-react-lite";
import { useTranslation, useViewContext } from "@app/front-kit";
import { SelectFieldOption } from "@app/ui-kit";
import { useObservableAsDeferredMemo } from "@worksolutions/react-utils";

import Card from "components/Card";
import GroupedContent from "components/FormField/GroupedContent";
import FormFieldText from "components/FormField/Text";
import FormFieldAttachments from "components/FormField/Attachments";
import FormFieldUserSelect from "components/FormField/UserSelect";
import FormFieldSelect from "components/FormField/Select";

import { EditDocumentRevisionEntity } from "core/storages/document/entities/revision/EditDocumentRevision";

import { UserFlowStorage } from "core/storages/user-flow";
import { DocumentRevisionsStorage } from "core/storages/document/revisions";

import FormFieldDate from "../../../../../../components/FormField/Date";
import FormFieldCheckbox from "../../../../../../components/FormField/Checkbox";

import { wrapperStyles } from "../View/style.css";

interface RevisionDetailMainEditInterface {
  loading: boolean;
  entity: EditDocumentRevisionEntity;
  canUpdateAttachments: boolean;
}

function RevisionDetailMainEdit({ loading, entity, canUpdateAttachments }: RevisionDetailMainEditInterface) {
  const { t } = useTranslation("document-revision-detail");
  const { containerInstance } = useViewContext();
  const revision = containerInstance.get(DocumentRevisionsStorage).revisionDetail;
  const { userFlows } = containerInstance.get(UserFlowStorage);
  const userFlowSelectOptions = useObservableAsDeferredMemo(
    (userFlows): SelectFieldOption<string | null>[] => {
      const options: SelectFieldOption<string | null>[] = [
        { value: null, label: t({ scope: "common:common_form_fields", place: "select", name: "none_value" }) },
      ];
      if (revision?.responsibleUserFlowApproving)
        options.push({
          value: "",
          label: t(
            { scope: "main_tab", place: "responsible_user_flow_field", name: "not_exists_user_flow" },
            { name: revision.responsibleUserFlowApproving.name },
          ),
        });
      options.push(...userFlows.map((userFlow) => ({ value: userFlow.id, label: userFlow.name })));
      return options;
    },
    [revision?.responsibleUserFlowApproving, t],
    userFlows,
  );

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
          <FormFieldDate
            edit
            title={t({ scope: "main_tab", place: "approving_deadline_field", name: "placeholder" })}
            disabled={loading}
            value={entity.approvingDeadline}
            errorMessage={entity.viewErrors.approvingDeadline}
            onChange={entity.setApprovingDeadline}
          />
          <FormFieldCheckbox
            edit
            disabled={loading}
            title={t({ scope: "main_tab", place: "can_prolong_approving_deadline_field", name: "placeholder" })}
            placeholder={t({ scope: "main_tab", place: "can_prolong_approving_deadline_field", name: "edit_value" })}
            value={entity.canProlongApprovingDeadline}
            onChange={entity.setCanProlongApprovingDeadline}
          />
          <FormFieldUserSelect
            hasNoUser
            disabled={loading}
            title={t({ scope: "main_tab", place: "responsible_user_field", name: "placeholder" })}
            value={entity.responsibleUser}
            errorMessage={entity.viewErrors.responsibleUser}
            onChange={entity.setResponsibleUser}
          />
          <FormFieldSelect
            edit
            disabled={loading}
            searchable
            title={t({ scope: "main_tab", place: "responsible_user_flow_field", name: "placeholder" })}
            value={entity.responsibleUserFlow}
            errorMessage={entity.viewErrors.responsibleUserFlow}
            options={userFlowSelectOptions}
            onChange={entity.setResponsibleUserFlow}
          />
          <FormFieldAttachments
            edit
            disabled={loading || !canUpdateAttachments}
            title={t({ scope: "main_tab", place: "attachments_field", name: "placeholder" })}
            disabledTooltipText={t({ scope: "main_tab", place: "attachments_field", name: "disabled_tooltip_text" })}
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
