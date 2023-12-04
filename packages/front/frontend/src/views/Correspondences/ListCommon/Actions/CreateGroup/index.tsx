import React from "react";
import { observer } from "mobx-react-lite";
import { useTranslation, useViewContext } from "@app/front-kit";
import { Button } from "@app/ui-kit";
import { useBoolean } from "@worksolutions/react-utils";

import EditCorrespondenceGroupModal from "views/Correspondences/Modals/EditGroup";

import { CorrespondenceStorage } from "core/storages/correspondence";

function CreateGroupAction() {
  const { t } = useTranslation("correspondence-list");
  const { loadGroupsAndCorrespondences } = useViewContext().containerInstance.get(CorrespondenceStorage);
  const [opened, oped, close] = useBoolean(false);

  const reloadCorrespondenceGroupsAndCorrespondences = React.useCallback(
    () => loadGroupsAndCorrespondences(),
    [loadGroupsAndCorrespondences],
  );

  return (
    <>
      <Button size="SMALL" type="OUTLINE" onClick={oped}>
        {t({ scope: "actions", place: "create_group", name: "button" })}
      </Button>
      <EditCorrespondenceGroupModal
        opened={opened}
        close={close}
        onSuccess={reloadCorrespondenceGroupsAndCorrespondences}
      />
    </>
  );
}

export default observer(CreateGroupAction);
