import React from "react";
import { observer } from "mobx-react-lite";
import { useTranslation } from "@app/front-kit";

import GroupedContent from "components/FormField/GroupedContent";

import { EditCorrespondenceEntity } from "core/storages/correspondence/entities/correspondence/EditCorrespondence";

import CorrespondencePermissionsList from "./PermissionsList";

interface CorrespondencePermissionsInterface {
  loading: boolean;
  entity: EditCorrespondenceEntity;
}

function CorrespondencePermissions({ loading, entity }: CorrespondencePermissionsInterface) {
  const { t } = useTranslation("correspondence-detail");

  return (
    <GroupedContent title={t({ scope: "main_tab", place: "members_field", name: "title" })}>
      <CorrespondencePermissionsList loading={loading} editing entity={entity} />
    </GroupedContent>
  );
}

export default observer(CorrespondencePermissions);
