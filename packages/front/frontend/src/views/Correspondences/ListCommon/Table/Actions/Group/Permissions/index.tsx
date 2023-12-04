import React from "react";
import { observer } from "mobx-react-lite";
import { useBoolean } from "@worksolutions/react-utils";
import { useTranslation } from "@app/front-kit";

import { AdditionalActionButton } from "components/AdditionalActions";

import { CorrespondenceGroupEntity } from "core/entities/correspondence/group";

import PermissionsModal from "./PermissionsModal";

interface CorrespondenceGroupPermissionsActionInterface {
  entity: CorrespondenceGroupEntity;
  onOpenedChange: (opened: boolean) => void;
}

function CorrespondenceGroupPermissionsAction({
  entity,
  onOpenedChange,
}: CorrespondenceGroupPermissionsActionInterface) {
  const { t } = useTranslation("correspondence-list");

  const [opened, open, close] = useBoolean(false);
  React.useEffect(() => onOpenedChange(opened), [opened, onOpenedChange]);

  return (
    <>
      <AdditionalActionButton
        text={t({ scope: "table", place: "body_group", name: "actions", parameter: "permissions" })}
        onClick={open}
      />
      <PermissionsModal opened={opened} entity={entity} onClose={close} />
    </>
  );
}

export default observer(CorrespondenceGroupPermissionsAction);
