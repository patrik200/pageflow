import React from "react";
import { useTranslation, useViewContext } from "@app/front-kit";
import { observer } from "mobx-react-lite";
import { useBoolean } from "@worksolutions/react-utils";

import CardTitlePreset from "components/Card/pressets/CardTitle";
import CardLoadingPreset from "components/Card/pressets/CardLoading";

import { EditDocumentRevisionEntity } from "core/storages/document/entities/revision/EditDocumentRevision";

import { DocumentRevisionsStorage } from "core/storages/document/revisions";

import PageWrapper from "../../_PageWrapper";
import RevisionDetailMainEdit from "../Detail/Tabs/Main/Edit";
import { useLoadRevision } from "../Detail/hooks/useLoad";
import DocumentRevisionCancelAction from "./Actions/Cancel";
import DocumentRevisionUpdateAction from "./Actions/Update";

function EditDocumentRevisionView() {
  const { t } = useTranslation("document-revision-detail");

  const revisionLoading = useLoadRevision();

  const { revisionDetail } = useViewContext().containerInstance.get(DocumentRevisionsStorage);

  const entity = React.useMemo(
    () => (revisionDetail ? EditDocumentRevisionEntity.buildFromRevisionEntity(revisionDetail) : null),
    [revisionDetail],
  );

  const [loading, enableLoading, disableLoading] = useBoolean(false);

  if (revisionLoading || !entity || !revisionDetail)
    return (
      <PageWrapper title={t({ scope: "meta", name: "edit_not_loaded" })}>
        <CardLoadingPreset title={t({ scope: "meta", name: "edit_not_loaded" })} />
      </PageWrapper>
    );

  return (
    <PageWrapper title={t({ scope: "meta", name: "edit" }, { number: revisionDetail.number })}>
      <CardTitlePreset
        title={t({ scope: "meta", name: "edit" }, { number: revisionDetail.number })}
        actions={
          <>
            <DocumentRevisionCancelAction entity={entity} enableLoading={enableLoading} />
            <DocumentRevisionUpdateAction
              entity={entity}
              enableLoading={enableLoading}
              disableLoading={disableLoading}
            />
          </>
        }
      />
      <RevisionDetailMainEdit loading={loading} entity={entity} canUpdateAttachments={revisionDetail.canUploadFiles} />
    </PageWrapper>
  );
}

export default observer(EditDocumentRevisionView);
