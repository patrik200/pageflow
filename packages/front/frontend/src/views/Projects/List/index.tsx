import React from "react";
import { observer } from "mobx-react-lite";
import { useTranslation } from "@app/front-kit";
import { breakpointTabletMin, useWidth } from "@app/ui-kit";

import CardTitlePreset from "components/Card/pressets/CardTitle";
import CardTablePreset from "components/Card/pressets/CardTable";

import { ProjectsListFiltersEntity } from "core/storages/project/entities/Filter";

import ProjectsListFilters from "./Filters";
import { useProjectsLoading } from "./Filters/useProjectsLoading";
import ProjectsTable from "./Table";
import CreateProjectAction from "./Actions/Create";
import PageWrapper from "../../_PageWrapper";
import ProjectList from "./MobileList";

function ProjectsListView() {
  const { t } = useTranslation("projects");

  const entity = React.useMemo(() => ProjectsListFiltersEntity.buildEmpty(), []);

  const { loading, loaded } = useProjectsLoading(entity);

  const width = useWidth();

  return (
    <PageWrapper loading={loaded ? false : loading} title={t({ scope: "meta", name: "title" })}>
      <CardTitlePreset title={t({ scope: "meta", name: "title" })} actions={<CreateProjectAction />}>
        <ProjectsListFilters filter={entity} loading={loading} />
      </CardTitlePreset>
      {width > breakpointTabletMin ? (
        <CardTablePreset>
          <ProjectsTable filter={entity} />
        </CardTablePreset>
      ) : (
        <ProjectList />
      )}
    </PageWrapper>
  );
}

export default observer(ProjectsListView);
