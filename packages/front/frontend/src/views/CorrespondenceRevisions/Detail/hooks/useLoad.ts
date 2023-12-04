import React from "react";
import { useAsyncFn } from "@worksolutions/react-utils";
import { useRouter, useViewContext } from "@app/front-kit";

import { CorrespondenceRevisionsStorage } from "core/storages/correspondence/revisions";
import { CorrespondenceStorage } from "core/storages/correspondence";

export function useLoadRevision() {
  const { id } = useRouter().query as { id: string };
  const { containerInstance } = useViewContext();
  const { loadCorrespondence } = containerInstance.get(CorrespondenceStorage);
  const { revisionDetail, loadRevisionDetail } = containerInstance.get(CorrespondenceRevisionsStorage);

  const [{ loading: revisionLoading }, asyncLoadRevisionDetail] = useAsyncFn(loadRevisionDetail, [loadRevisionDetail], {
    loading: true,
  });
  React.useEffect(() => void asyncLoadRevisionDetail(id), [asyncLoadRevisionDetail, id]);
  React.useEffect(() => {
    if (!revisionDetail) return;
    loadCorrespondence(revisionDetail.correspondence.id);
  }, [loadCorrespondence, revisionDetail]);

  return revisionLoading;
}
