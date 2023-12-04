import React from "react";
import { observer } from "mobx-react-lite";
import { useTranslation, useViewContext } from "@app/front-kit";
import { useBoolean } from "@worksolutions/react-utils";

import { AdditionalActionButton } from "components/AdditionalActions";

import { CorrespondenceGroupEntity } from "core/entities/correspondence/group";

import { CorrespondenceStorage } from "core/storages/correspondence";

import MoveCorrespondenceGroupModal from "../../../../../Modals/MoveGroup";

interface MoveCorrespondenceGroupActionInterface {
  entity: CorrespondenceGroupEntity;
  onOpenedChange: (opened: boolean) => void;
}

function MoveCorrespondenceGroupAction({ entity, onOpenedChange }: MoveCorrespondenceGroupActionInterface) {
  const { t } = useTranslation("correspondence-list");

  const [moveOpened, openMove, closeMove] = useBoolean(false);
  React.useEffect(() => onOpenedChange(moveOpened), [moveOpened, onOpenedChange]);

  const { filter, loadGroupsAndCorrespondences } = useViewContext().containerInstance.get(CorrespondenceStorage);
  const handleReload = React.useCallback(() => loadGroupsAndCorrespondences(), [loadGroupsAndCorrespondences]);
  if (!entity.resultCanEdit) return null;

  return (
    <>
      <AdditionalActionButton
        text={t({ scope: "table", place: "body_group", name: "actions", parameter: "move" })}
        onClick={openMove}
      />
      <MoveCorrespondenceGroupModal
        opened={moveOpened}
        initialFilter={filter}
        group={entity}
        close={closeMove}
        onSuccess={handleReload}
      />
    </>
  );
}

export default observer(MoveCorrespondenceGroupAction);
