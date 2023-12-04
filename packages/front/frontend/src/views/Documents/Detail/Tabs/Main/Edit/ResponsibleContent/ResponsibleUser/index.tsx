import React from "react";
import { observer } from "mobx-react-lite";

import FormFieldUserSelect from "components/FormField/UserSelect";

import { EditDocumentEntity } from "core/storages/document/entities/document/EditDocument";

interface DocumentResponsibleUserInterface {
  loading: boolean;
  entity: EditDocumentEntity;
}

function DocumentResponsibleUser({ loading, entity }: DocumentResponsibleUserInterface) {
  return (
    <FormFieldUserSelect
      disabled={loading}
      hasNoUser
      value={entity.responsibleUser}
      errorMessage={entity.viewErrors.responsibleUser}
      onChange={entity.setResponsibleUser}
    />
  );
}

export default observer(DocumentResponsibleUser);
