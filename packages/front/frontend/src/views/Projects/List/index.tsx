import React from "react";
import { observer } from "mobx-react-lite";
import { useTranslation } from "@app/front-kit";

import CardTitlePreset from "components/Card/pressets/CardTitle";
import CardTablePreset from "components/Card/pressets/CardTable";

import { ProjectsListFiltersEntity } from "core/storages/project/entities/Filter";

import ProjectsListFilters from "./Filters";
import { useProjectsLoading } from "./Filters/useProjectsLoading";
import ProjectsTable from "./Table";
import CreateProjectAction from "./Actions/Create";
import PageWrapper from "../../_PageWrapper";

function ProjectsListView() {
  const { t } = useTranslation("projects");

  const entity = React.useMemo(() => ProjectsListFiltersEntity.buildEmpty(), []);

  const { loading, loaded } = useProjectsLoading(entity);

  return (
    <PageWrapper loading={loaded ? false : loading} title={t({ scope: "meta", name: "title" })}>
      <CardTitlePreset title={t({ scope: "meta", name: "title" })} actions={<CreateProjectAction />}>
        <ProjectsListFilters filter={entity} loading={loading} />
      </CardTitlePreset>
      <CardTablePreset>
        <ProjectsTable filter={entity} />
      </CardTablePreset>
    </PageWrapper>
  );
}

export default observer(ProjectsListView);
