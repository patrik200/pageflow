import React from "react";
import { useAsyncFn } from "@worksolutions/react-utils";
import { useRouter, useViewContext } from "@app/front-kit";

import { ProjectStorage } from "core/storages/project";

export function useLoadProject() {
  const { id } = useRouter().query as { id: string };
  const { loadProjectDetail, projectDetail } = useViewContext().containerInstance.get(ProjectStorage);
  const [{ loading }, asyncLoadProjectDetail] = useAsyncFn(loadProjectDetail, [loadProjectDetail], { loading: true });
  React.useEffect(() => void asyncLoadProjectDetail(id), [asyncLoadProjectDetail, id]);

  return [loading, projectDetail] as const;
}
