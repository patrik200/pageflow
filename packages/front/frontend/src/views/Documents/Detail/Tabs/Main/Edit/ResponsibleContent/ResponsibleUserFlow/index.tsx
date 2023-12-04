import React from "react";
import { observer } from "mobx-react-lite";
import { SelectFieldOption } from "@app/ui-kit";
import { useViewContext } from "@app/front-kit";
import { useObservableAsDeferredMemo } from "@worksolutions/react-utils";

import { EditDocumentEntity } from "core/storages/document/entities/document/EditDocument";

import { UserFlowStorage } from "../../../../../../../../core/storages/user-flow";
import FormFieldSelect from "../../../../../../../../components/FormField/Select";

interface DocumentResponsibleUserFlowInterface {
  loading: boolean;
  entity: EditDocumentEntity;
}

function DocumentResponsibleUserFlow({ loading, entity }: DocumentResponsibleUserFlowInterface) {
  const { userFlows } = useViewContext().containerInstance.get(UserFlowStorage);
  const options = useObservableAsDeferredMemo(
    (userFlows): SelectFieldOption<string>[] =>
      userFlows.map((userFlow) => ({ value: userFlow.id, label: userFlow.name })),
    [],
    userFlows,
  );

  return (
    <FormFieldSelect
      edit
      disabled={loading}
      searchable
      value={entity.responsibleUserFlow}
      options={options}
      onChange={entity.setResponsibleUserFlow}
    />
  );
}

export default observer(DocumentResponsibleUserFlow);
