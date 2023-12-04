import React from "react";
import { observer } from "mobx-react-lite";
import { useViewContext } from "@app/front-kit";

import FormFieldSelect from "components/FormField/Select";
import UserRowCustomSelectFieldTrigger from "components/UserRow/CustomSelectFieldTrigger";
import { useAllUsersSelectFieldOptions } from "components/FormField/UserSelect";

import { DocumentStorage } from "core/storages/document";

function DocumentResponsibleUser() {
  const { containerInstance } = useViewContext();
  const document = containerInstance.get(DocumentStorage).documentDetail!;
  const options = useAllUsersSelectFieldOptions(false);

  return (
    <FormFieldSelect
      view
      value={document.responsibleUser?.id ?? null}
      options={options}
      TextViewTrigger={UserRowCustomSelectFieldTrigger}
    />
  );
}

export default observer(DocumentResponsibleUser);
