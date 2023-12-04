import React from "react";
import { observer } from "mobx-react-lite";
import { useTranslation, useViewContext } from "@app/front-kit";
import { useAsyncFn } from "@worksolutions/react-utils";

import CardTable from "components/Card/pressets/CardTable";

import { HomeStorage } from "core/storages/home";

import PageWrapper from "../_PageWrapper";
import HomeDocument from "./Document";
import HomeDocumentRevision from "./DocumentRevision";
import HomeCorrespondence from "./Correspondence";
import HomeCorrespondenceRevision from "./CorrespondenceRevision";
import HomeProject from "./Project";
import HomeCorrespondenceGroup from "./CorrespondenceGroup";
import HomeDocumentGroup from "./DocumentGroup";

function HomeView() {
  const { t } = useTranslation("home");
  const {
    loadAll,
    documents,
    documentGroups,
    documentRevisions,
    correspondences,
    correspondenceGroups,
    correspondenceRevisions,
    projects,
  } = useViewContext().containerInstance.get(HomeStorage);
  const [{ loading }, asyncLoadAll] = useAsyncFn(loadAll, [loadAll], { loading: true });
  React.useEffect(() => void asyncLoadAll(), [asyncLoadAll]);

  return (
    <PageWrapper loading={loading} title={t({ scope: "meta", name: "title" })}>
      {documents.length === 0 &&
        documentRevisions.length === 0 &&
        correspondences.length === 0 &&
        correspondenceRevisions.length === 0 &&
        projects.length === 0 && (
          <CardTable title={t({ scope: "need_to_add_to_favourites_card", name: "title" })}>{null}</CardTable>
        )}
      {documents.length !== 0 && (
        <CardTable title={t({ scope: "documents_card", name: "title" })}>
          {documents.map((document) => (
            <HomeDocument key={document.id} document={document} />
          ))}
        </CardTable>
      )}
      {documentGroups.length !== 0 && (
        <CardTable title={t({ scope: "document_groups_card", name: "title" })}>
          {documentGroups.map((group) => (
            <HomeDocumentGroup key={group.id} group={group} />
          ))}
        </CardTable>
      )}
      {documentRevisions.length !== 0 && (
        <CardTable title={t({ scope: "document_revisions_card", name: "title" })}>
          {documentRevisions.map((revision) => (
            <HomeDocumentRevision key={revision.id} revision={revision} />
          ))}
        </CardTable>
      )}
      {correspondences.length !== 0 && (
        <CardTable title={t({ scope: "correspondences_card", name: "title" })}>
          {correspondences.map((correspondence) => (
            <HomeCorrespondence key={correspondence.id} correspondence={correspondence} />
          ))}
        </CardTable>
      )}
      {correspondenceGroups.length !== 0 && (
        <CardTable title={t({ scope: "correspondence_groups_card", name: "title" })}>
          {correspondenceGroups.map((group) => (
            <HomeCorrespondenceGroup key={group.id} group={group} />
          ))}
        </CardTable>
      )}
      {correspondenceRevisions.length !== 0 && (
        <CardTable title={t({ scope: "correspondence_revisions_card", name: "title" })}>
          {correspondenceRevisions.map((revision) => (
            <HomeCorrespondenceRevision key={revision.id} revision={revision} />
          ))}
        </CardTable>
      )}
      {projects.length !== 0 && (
        <CardTable title={t({ scope: "projects_card", name: "title" })}>
          {projects.map((project) => (
            <HomeProject key={project.id} project={project} />
          ))}
        </CardTable>
      )}
    </PageWrapper>
  );
}

export default observer(HomeView);
