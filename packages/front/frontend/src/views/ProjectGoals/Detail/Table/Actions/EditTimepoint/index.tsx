import React from "react";
import { observer } from "mobx-react-lite";
import { useBoolean } from "@worksolutions/react-utils";
import { Button } from "@app/ui-kit";

import EditTimepointModal from "views/ProjectGoals/Modals/EditTimepoint";

import { TimepointEntity } from "core/entities/goal/timepoint";

interface EditTimepointInterface {
  entity: TimepointEntity;
}

function EditTimepointAction({ entity }: EditTimepointInterface) {
  const [opened, onOpen, onClose] = useBoolean(false);

  return (
    <>
      <Button size="SMALL" iconLeft="editLine" type="WITHOUT_BORDER" onClick={onOpen} />
      <EditTimepointModal opened={opened} close={onClose} timepoint={entity} />
    </>
  );
}

export default observer(EditTimepointAction);
