import React from "react";
import { useAsyncFn } from "@worksolutions/react-utils";
import { useRouter, useViewContext } from "@app/front-kit";

import { DocumentRevisionsStorage } from "core/storages/document/revisions";
import { UserFlowStorage } from "core/storages/user-flow";
import { DocumentStorage } from "core/storages/document";

export function useLoadRevision() {
  const { id } = useRouter().query as { id: string };
  const { containerInstance } = useViewContext();
  const { loadDocument } = containerInstance.get(DocumentStorage);
  const { revisionDetail, loadRevisionDetail } = containerInstance.get(DocumentRevisionsStorage);
  const { loadUserFlow } = containerInstance.get(UserFlowStorage);
  const [, asyncLoadDocument] = useAsyncFn(loadDocument, [loadDocument], {
    loading: true,
  });
  const [{ loading: revisionLoading }, asyncLoadRevisionDetail] = useAsyncFn(loadRevisionDetail, [loadRevisionDetail], {
    loading: true,
  });
  const [{ loading: userFlowLoading }, asyncLoadUserFlow] = useAsyncFn(loadUserFlow, [loadUserFlow], {
    loading: true,
  });

  React.useEffect(() => {
    if (!revisionDetail) return;
    void asyncLoadDocument(revisionDetail.document.id);
  }, [asyncLoadDocument, revisionDetail]);

  React.useEffect(() => void asyncLoadUserFlow(), [asyncLoadUserFlow]);
  React.useEffect(() => void asyncLoadRevisionDetail(id), [asyncLoadRevisionDetail, id]);

  return revisionLoading || userFlowLoading;
}
