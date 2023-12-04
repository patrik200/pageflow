import React from "react";
import { observer } from "mobx-react-lite";
import { useTranslation, useViewContext } from "@app/front-kit";
import { TabItemInterface } from "@app/ui-kit";

import CardLoadingPreset from "components/Card/pressets/CardLoading";
import CardTitleTabsPreset from "components/Card/pressets/CardTitleTabs";
import { PrivateIndicatorForDetail } from "components/PrivateIndicator";
import ArchivedTag from "components/Card/pressets/CardTitle/ArchivedTag";

import { CorrespondenceStorage } from "core/storages/correspondence";

import PageWrapper from "../../_PageWrapper";
import CorrespondenceDetailDependsOnView from "./Tabs/DependsOn/View";
import CorrespondenceDetailDependsToView from "./Tabs/DependsTo/View";
import CorrespondenceDetailMainView from "./Tabs/Main/View";
import CorrespondenceActions from "./Actions";

import { useTabs } from "internal/hooks/useTags";

import { useLoadCorrespondence } from "./hooks/useLoad";
import { useCorrespondenceBreadcrumbs } from "./hooks/useBreadcrumbs";

type Tabs = "main" | "dependsOn" | "dependsTo" | "tickets";

function CorrespondenceDetailView() {
  const { t } = useTranslation("correspondence-detail");

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

  const loading = useLoadCorrespondence();
  const { correspondenceDetail } = useViewContext().containerInstance.get(CorrespondenceStorage);

  const breadcrumbs = useCorrespondenceBreadcrumbs();

  if (loading || !correspondenceDetail)
    return (
      <PageWrapper title={t({ scope: "meta", name: "view" }, { name: "" })}>
        <CardLoadingPreset title={t({ scope: "meta", name: "view" }, { name: "" })} />
      </PageWrapper>
    );

  return (
    <PageWrapper title={t({ scope: "meta", name: "view" }, { name: correspondenceDetail.name })}>
      <CardTitleTabsPreset
        title={correspondenceDetail.name}
        preTitle={
          <>
            {correspondenceDetail.isPrivate && <PrivateIndicatorForDetail />}
            {correspondenceDetail.archived && <ArchivedTag />}
          </>
        }
        actions={<CorrespondenceActions correspondence={correspondenceDetail} />}
        breadcrumbs={breadcrumbs}
        items={tabs}
        active={tab}
        onChange={setTab}
      />
      {tab === "main" && <CorrespondenceDetailMainView />}
      {tab === "dependsOn" && <CorrespondenceDetailDependsOnView />}
      {tab === "dependsTo" && <CorrespondenceDetailDependsToView />}
    </PageWrapper>
  );
}

export default observer(CorrespondenceDetailView);
