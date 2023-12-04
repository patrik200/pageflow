import React from "react";
import { observer } from "mobx-react-lite";
import { useRouter, useTranslation, useViewContext } from "@app/front-kit";
import { Button } from "@app/ui-kit";
import { useAsyncFn } from "@worksolutions/react-utils";

import { DocumentStorage } from "core/storages/document";
import { GoalStorage } from "core/storages/goal";

function CreateGoalAction() {
  const { t } = useTranslation("goal-list");
  const { filter } = useViewContext().containerInstance.get(GoalStorage);

  const push = useRouter().push.current;
  const [{ loading }, asyncPush] = useAsyncFn(push, [push]);

  const handleClick = React.useCallback(
    () =>
      void asyncPush({
        pathname: "/goals/create",
        query: { project: filter!._projectId },
      }),
    [asyncPush, filter!._projectId],
  );

  return (
    <Button loading={loading} size="SMALL" type="OUTLINE" onClick={handleClick}>
      {t({ scope: "actions", place: "create_goal", name: "button" })}
    </Button>
  );
}

export default observer(CreateGoalAction);