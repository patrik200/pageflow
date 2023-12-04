import React from "react";
import { observer } from "mobx-react-lite";
import { useViewContext } from "@app/front-kit";

import AdditionalActions from "components/AdditionalActions";

import { CorrespondenceRevisionsStorage } from "core/storages/correspondence/revisions";
import { CorrespondenceStorage } from "core/storages/correspondence";

import DeleteCorrespondenceRevisionAction from "./Delete";
import ArchiveCorrespondenceRevisionAction from "./Archive";
import ActiveCorrespondenceRevisionAction from "./Active";

function CorrespondenceRevisionAdditionalActions() {
  const [deleteOpened, setDeleteOpened] = React.useState(false);

  const { containerInstance } = useViewContext();
  const revision = containerInstance.get(CorrespondenceRevisionsStorage).revisionDetail!;
  const correspondence = containerInstance.get(CorrespondenceStorage).correspondenceDetail;

  if (!correspondence?.resultCanEdit) return null;
  if (!revision.canActiveByStatus && !revision.canArchiveByStatus) return null;

  return (
    <AdditionalActions closeOnClickOutside={!deleteOpened}>
      <ArchiveCorrespondenceRevisionAction />
      <ActiveCorrespondenceRevisionAction />
      <DeleteCorrespondenceRevisionAction openedOnChange={setDeleteOpened} />
    </AdditionalActions>
  );
}

export default observer(CorrespondenceRevisionAdditionalActions);
