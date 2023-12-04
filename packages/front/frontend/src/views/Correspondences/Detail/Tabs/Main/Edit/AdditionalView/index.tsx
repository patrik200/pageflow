import React from "react";
import { observer } from "mobx-react-lite";

import { EditCorrespondenceEntity } from "core/storages/correspondence/entities/correspondence/EditCorrespondence";

import CorrespondencePermissions from "./Fields/Permissions";

interface AdditionalViewInterface {
  loading: boolean;
  entity: EditCorrespondenceEntity;
}

function AdditionalView({ loading, entity }: AdditionalViewInterface) {
  return (
    <>
      <CorrespondencePermissions entity={entity} loading={loading} />
    </>
  );
}

export default observer(AdditionalView);
