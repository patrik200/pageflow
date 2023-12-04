import React from "react";
import { templateReact, useTranslation, useViewContext } from "@app/front-kit";
import { observer } from "mobx-react-lite";
import { TabItemInterface } from "@app/ui-kit";

import CardTitleTabsPreset from "components/Card/pressets/CardTitleTabs";
import CardLoadingPreset from "components/Card/pressets/CardLoading";
import { InformerIndicatorForDetail } from "components/InformerIndicator";
import DaysRemaining from "components/DaysRemaining";
import ArchivedTag from "components/Card/pressets/CardTitle/ArchivedTag";

import { DocumentRevisionsStorage } from "core/storages/document/revisions";

import PageWrapper from "../../_PageWrapper";
import RevisionDetailMainView from "./Tabs/Main/View";
import RevisionActions from "./Actions";

import { useTabs } from "internal/hooks/useTags";

import { useLoadRevision } from "./hooks/useLoad";
import { useBreadcrumbs } from "./hooks/useBreadcrumbs";

type Tabs = "main" | "dependsOn" | "dependsTo" | "tickets";

function DocumentRevisionDetailView() {
  const { t } = useTranslation("document-revision-detail");

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

  const loading = useLoadRevision();
  const { revisionDetail } = useViewContext().containerInstance.get(DocumentRevisionsStorage);

  const breadcrumbs = useBreadcrumbs();

  if (loading || !revisionDetail)
    return (
      <PageWrapper title={t({ scope: "meta", name: "view_not_loaded" })}>
        <CardLoadingPreset title={t({ scope: "meta", name: "view_not_loaded" })} />
      </PageWrapper>
    );

  return (
    <PageWrapper title={t({ scope: "meta", name: "view" }, { number: revisionDetail.number })}>
      <CardTitleTabsPreset
        title={revisionDetail.number}
        actions={<RevisionActions />}
        preTitle={
          <>
            {revisionDetail.approvingDeadlineRemainingDays !== null && (
              <InformerIndicatorForDetail
                tooltip={templateReact(t({ scope: "revision_title", name: "approving_deadline_remaining_warning" }), {
                  days: <DaysRemaining days={revisionDetail.approvingDeadlineRemainingDays} />,
                })}
              />
            )}
            {revisionDetail.archived && <ArchivedTag />}
          </>
        }
        breadcrumbs={breadcrumbs}
        items={tabs}
        active={tab}
        onChange={setTab}
      />
      {tab === "main" && <RevisionDetailMainView />}
    </PageWrapper>
  );
}

export default observer(DocumentRevisionDetailView);
