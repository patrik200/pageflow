import React from "react";
import { observer } from "mobx-react-lite";
import { useBoolean } from "@worksolutions/react-utils";
import { useTranslation, useViewContext } from "@app/front-kit";

import { AdditionalActionButton } from "components/AdditionalActions";

import { CorrespondenceEntity } from "core/entities/correspondence/correspondence";

import { CorrespondenceStorage } from "core/storages/correspondence";

import MoveCorrespondenceModal from "../../../../../Modals/MoveCorrespondence";

interface MoveCorrespondenceActionInterface {
  entity: CorrespondenceEntity;
  onOpenedChange: (opened: boolean) => void;
}

function MoveCorrespondenceAction({ entity, onOpenedChange }: MoveCorrespondenceActionInterface) {
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
      <MoveCorrespondenceModal
        opened={moveOpened}
        initialFilter={filter}
        correspondence={entity}
        close={closeMove}
        onSuccess={handleReload}
      />
    </>
  );
}

export default observer(MoveCorrespondenceAction);
