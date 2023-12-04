import React from "react";
import { useAsyncFn } from "@worksolutions/react-utils";
import { useRouter, useViewContext } from "@app/front-kit";

import { DocumentStorage } from "core/storages/document";
import { UserFlowStorage } from "core/storages/user-flow";

export function useLoadDocument() {
  const { id } = useRouter().query as { id: string };
  const { containerInstance } = useViewContext();
  const { loadDocument } = containerInstance.get(DocumentStorage);
  const { loadUserFlow } = containerInstance.get(UserFlowStorage);
  const [{ loading: documentLoading }, asyncLoadDocumentDetail] = useAsyncFn(loadDocument, [loadDocument], {
    loading: true,
  });
  const [{ loading: userFlowLoading }, asyncLoadUserFlow] = useAsyncFn(loadUserFlow, [loadUserFlow], {
    loading: true,
  });
  React.useEffect(() => void asyncLoadDocumentDetail(id), [asyncLoadDocumentDetail, id]);
  React.useEffect(() => void asyncLoadUserFlow(), [asyncLoadUserFlow]);

  return documentLoading || userFlowLoading;
}
