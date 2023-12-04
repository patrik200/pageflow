import React from "react";
import { observer } from "mobx-react-lite";
import { useViewContext } from "@app/front-kit";
import { useObservableAsDeferredMemo } from "@worksolutions/react-utils";
import { SelectFieldOption } from "@app/ui-kit";
import cn from "classnames";

import FormFieldSelect from "components/FormField/Select";

import { DocumentStorage } from "core/storages/document";
import { UserFlowStorage } from "core/storages/user-flow";

import { notEmptyStyles } from "./style.css";

function DocumentResponsibleUserFlow() {
  const { containerInstance } = useViewContext();
  const document = containerInstance.get(DocumentStorage).documentDetail!;
  const { userFlows } = containerInstance.get(UserFlowStorage);
  const options = useObservableAsDeferredMemo(
    (userFlows): SelectFieldOption<string>[] =>
      userFlows.map((userFlow) => ({ value: userFlow.id, label: userFlow.name })),
    [],
    userFlows,
  );

  return (
    <FormFieldSelect
      className={cn(document.responsibleUserFlow && notEmptyStyles)}
      view
      value={document.responsibleUserFlow?.id ?? null}
      options={options}
    />
  );
}

export default observer(DocumentResponsibleUserFlow);
