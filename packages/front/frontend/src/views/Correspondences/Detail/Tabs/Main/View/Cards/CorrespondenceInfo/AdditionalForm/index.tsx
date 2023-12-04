import React from "react";
import { observer } from "mobx-react-lite";
import { useTranslation, useViewContext } from "@app/front-kit";
import { Button } from "@app/ui-kit";
import { useToggle } from "@worksolutions/react-utils";

import GroupedContent from "components/FormField/GroupedContent";

import { EditCorrespondenceEntity } from "core/storages/correspondence/entities/correspondence/EditCorrespondence";

import { CorrespondenceStorage } from "core/storages/correspondence";

import CorrespondencePermissionsList from "../../../../Edit/AdditionalView/Fields/Permissions/PermissionsList";

function AdditionalForm() {
  const { t } = useTranslation("correspondence-detail");
  const correspondence = useViewContext().containerInstance.get(CorrespondenceStorage).correspondenceDetail!;

  const [editing, toggleEditing] = useToggle(false);

  const entity = React.useMemo(
    () => EditCorrespondenceEntity.buildFromCorrespondenceDetailForClient(correspondence),
    [correspondence],
  );

  return (
    <GroupedContent
      title={t({ scope: "main_tab", place: "members_field", name: "title" })}
      actions={
        <Button
          iconLeft={editing ? "closeLine" : "editLine"}
          size="EXTRA_SMALL"
          type="WITHOUT_BORDER"
          onClick={toggleEditing}
        />
      }
    >
      <CorrespondencePermissionsList entity={entity} editing={editing} />
    </GroupedContent>
  );
}

export default observer(AdditionalForm);
