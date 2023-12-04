import React from "react";
import { observer } from "mobx-react-lite";
import { useTranslation, useViewContext } from "@app/front-kit";
import { TabItemInterface } from "@app/ui-kit";

import CardLoadingPreset from "components/Card/pressets/CardLoading";
import CardTitleTabsPreset from "components/Card/pressets/CardTitleTabs";
import { PrivateIndicatorForDetail } from "components/PrivateIndicator";
import ArchivedTag from "components/Card/pressets/CardTitle/ArchivedTag";

import { DocumentStorage } from "core/storages/document";

import PageWrapper from "../../_PageWrapper";
import DocumentDetailDependsOnView from "./Tabs/DependsOn/View";
import DocumentDetailDependsToView from "./Tabs/DependsTo/View";
import ProjectDetailMainView from "./Tabs/Main/View";
import DocumentActions from "./Actions";

import { useTabs } from "internal/hooks/useTags";

import { useLoadDocument } from "./hooks/useLoad";
import { useBreadcrumbs } from "./hooks/useBreadcrumbs";

type Tabs = "main" | "dependsOn" | "dependsTo" | "tickets";

function DocumentDetailView() {
  const { t } = useTranslation("document-detail");

  const { tab, setTab } = useTabs<Tabs>("main");

  const tabs = React.useMemo<TabItemInterface<Tabs>[]>(
    () => [
      { code: "main", title: t({ scope: "tabs", name: "main" }) },
      // { code: "dependsOn", title: t({ scope: "tabs", name: "depends_on" }) },
      // { code: "dependsTo", title: t({ scope: "tabs", name: "depends_to" }) },
      // { code: "tickets", title: t({ scope: "tabs", name: "tickets" }) },
    ],
    [t],
  );

  const loading = useLoadDocument();
  const { documentDetail } = useViewContext().containerInstance.get(DocumentStorage);

  const breadcrumbs = useBreadcrumbs();

  if (loading || !documentDetail)
    return (
      <PageWrapper title={t({ scope: "meta", name: "view" }, { name: "" })}>
        <CardLoadingPreset title={t({ scope: "meta", name: "view" }, { name: "" })} />
      </PageWrapper>
    );

  return (
    <PageWrapper title={t({ scope: "meta", name: "view" }, { name: documentDetail.name })}>
      <CardTitleTabsPreset
        title={documentDetail.name}
        preTitle={
          <>
            {documentDetail.isPrivate && <PrivateIndicatorForDetail />}
            {documentDetail.archived && <ArchivedTag />}
          </>
        }
        actions={<DocumentActions document={documentDetail} />}
        breadcrumbs={breadcrumbs}
        items={tabs}
        active={tab}
        onChange={setTab}
      />
      {tab === "main" && <ProjectDetailMainView />}
      {tab === "dependsOn" && <DocumentDetailDependsOnView />}
      {tab === "dependsTo" && <DocumentDetailDependsToView />}
    </PageWrapper>
  );
}

export default observer(DocumentDetailView);
