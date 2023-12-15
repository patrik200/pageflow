import React from "react";
import { templateReact, useTranslation } from "@app/front-kit";
import { TabItemInterface } from "@app/ui-kit";

import CardTitleTabsPreset from "components/Card/pressets/CardTitleTabs";
import CardLoadingPreset from "components/Card/pressets/CardLoading";
import { PrivateIndicatorForDetail } from "components/PrivateIndicator";
import { InformerIndicatorForDetail } from "components/InformerIndicator";
import DaysRemaining from "components/DaysRemaining";
import CompletedTag from "components/Card/pressets/CardTitle/CompletedTag";
import ArchivedTag from "components/Card/pressets/CardTitle/ArchivedTag";

import PageWrapper from "../../_PageWrapper";
import ProjectActions from "./Actions";
import ProjectDetailMainView from "./Tabs/Main/View";
import ProjectTicketsKanbanView from "./Tabs/Tickets";
import ProjectGoalsTab from "./Tabs/Goals";
import ProjectCorrespondencesTab from "./Tabs/Correspondences";
import ProjectDocumentsTab from "./Tabs/Documents";

import { useTabs } from "internal/hooks/useTags";

import { useLoadProject } from "./hooks/useLoad";

type Tabs = "main" | "documents" | "correspondence" | "tickets" | "user_work_flow" | "goals";

function ProjectDetailView() {
  const { t } = useTranslation("project-detail");

  const { tab, setTab } = useTabs<Tabs>("main");

  const tabs = React.useMemo<TabItemInterface<Tabs>[]>(
    () => [
      { code: "main", title: t({ scope: "tabs", name: "main" }) },
      { code: "documents", title: t({ scope: "tabs", name: "documents" }) },
      { code: "correspondence", title: t({ scope: "tabs", name: "correspondence" }) },
      { code: "tickets", title: t({ scope: "tabs", name: "tickets" }) },
      { code: "goals", title: t({ scope: "tabs", name: "goals" }) },
    ],
    [t],
  );

  const [loading, projectDetail] = useLoadProject();

  if (loading || !projectDetail)
    return (
      <PageWrapper title={t({ scope: "meta", name: "view" }, { name: "" })}>
        <CardLoadingPreset title={t({ scope: "meta", name: "view" }, { name: "" })} />
      </PageWrapper>
    );

  return (
    <PageWrapper title={t({ scope: "meta", name: "view" }, { name: projectDetail.name })}>
      <CardTitleTabsPreset
        preTitle={
          <>
            {projectDetail.isPrivate && <PrivateIndicatorForDetail />}
            {projectDetail.viewEndDatePlanRemainingWarning !== null && (
              <InformerIndicatorForDetail
                tooltip={templateReact(t({ scope: "project_title", name: "plan_remaining_warning" }), {
                  days: <DaysRemaining days={projectDetail.viewEndDatePlanRemainingWarning} />,
                })}
              />
            )}
            {projectDetail.completed && (
              <CompletedTag text={t({ scope: "project_title", name: "completed_tag" })} mode="success" />
            )}
            {projectDetail.archived && <ArchivedTag />}
          </>
        }
        title={projectDetail.name}
        actions={<ProjectActions project={projectDetail} />}
        items={tabs}
        active={tab}
        onChange={setTab}
      />
      {tab === "main" && <ProjectDetailMainView project={projectDetail} />}
      {tab === "documents" && <ProjectDocumentsTab project={projectDetail} />}
      {tab === "correspondence" && <ProjectCorrespondencesTab project={projectDetail} />}
      {tab === "tickets" && <ProjectTicketsKanbanView />}
      {tab === "goals" && <ProjectGoalsTab project={projectDetail} />}
    </PageWrapper>
  );
}

export default React.memo(ProjectDetailView);
