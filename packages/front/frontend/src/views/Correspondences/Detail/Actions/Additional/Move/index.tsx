import React from "react";
import { observer } from "mobx-react-lite";
import { useTranslation } from "@app/front-kit";
import { useBoolean } from "@worksolutions/react-utils";

import { AdditionalActionButton } from "components/AdditionalActions";

import { CorrespondenceEntity } from "core/entities/correspondence/correspondence";
import { CorrespondenceFilterEntity } from "core/storages/correspondence/entities/correspondence/CorrespondenceFilter";

import MoveCorrespondenceModal from "../../../../Modals/MoveCorrespondence";

interface MoveCorrespondenceActionInterface {
  correspondence: CorrespondenceEntity;
  onOpenedChange: (opened: boolean) => void;
}

function MoveCorrespondenceAction({ correspondence, onOpenedChange }: MoveCorrespondenceActionInterface) {
  const { t } = useTranslation("correspondence-detail");

  const [moveOpened, openMove, closeMove] = useBoolean(false);
  React.useEffect(() => onOpenedChange(moveOpened), [moveOpened, onOpenedChange]);

  const initialFilterForMove = React.useMemo(
    () => CorrespondenceFilterEntity.buildForCorrespondence(correspondence),
    [correspondence],
  );

  if (!correspondence.resultCanEdit) return null;

  return (
    <>
      <AdditionalActionButton
        text={t({ scope: "move_correspondence", place: "action", name: "move" })}
        onClick={openMove}
      />
      <MoveCorrespondenceModal
        correspondence={correspondence}
        opened={moveOpened}
        initialFilter={initialFilterForMove}
        close={closeMove}
      />
    </>
  );
}

export default observer(MoveCorrespondenceAction);
