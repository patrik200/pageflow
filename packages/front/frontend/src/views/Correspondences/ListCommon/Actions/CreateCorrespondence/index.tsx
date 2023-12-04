import React from "react";
import { observer } from "mobx-react-lite";
import { useRouter, useTranslation, useViewContext } from "@app/front-kit";
import { Button } from "@app/ui-kit";
import { useAsyncFn } from "@worksolutions/react-utils";

import { CorrespondenceStorage } from "core/storages/correspondence";

function CreateCorrespondenceAction() {
  const { t } = useTranslation("correspondence-list");
  const { filter } = useViewContext().containerInstance.get(CorrespondenceStorage);

  const push = useRouter().push.current;
  const [{ loading }, asyncPush] = useAsyncFn(push, [push]);

  const handleClick = React.useCallback(
    () =>
      void asyncPush({
        pathname: "/correspondences/create",
        query: { parentGroup: filter.parentGroupId, project: filter._projectId },
      }),
    [asyncPush, filter._projectId, filter.parentGroupId],
  );

  return (
    <Button loading={loading} size="SMALL" type="OUTLINE" onClick={handleClick}>
      {t({ scope: "actions", place: "create_correspondence", name: "button" })}
    </Button>
  );
}

export default observer(CreateCorrespondenceAction);
