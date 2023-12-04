import React from "react";
import { observer } from "mobx-react-lite";
import { useTranslation } from "@app/front-kit";

import Filters, { FiltersSecondaryRow } from "components/Filters";
import FilterSearchTextField from "components/Filters/pressets/FilterSearchTextField";
import FilterCheckboxField from "components/Filters/pressets/FilterCheckboxField";
import FilterUserField from "components/Filters/pressets/FilterUserField";

import { ProjectsListFiltersEntity } from "core/storages/project/entities/Filter";

interface ProjectsListFiltersInterface {
  filter: ProjectsListFiltersEntity;
  loading?: boolean;
}

function ProjectsListFilters({ filter, loading }: ProjectsListFiltersInterface) {
  const { t } = useTranslation("projects");

  return (
    <Filters
      primaryRow={
        <>
          <FilterSearchTextField
            loading={loading}
            value={filter.search}
            placeholder={t({ scope: "filters", name: "search", parameter: "placeholder" })}
            onChangeInput={filter.setSearch}
          />
        </>
      }
      secondaryRow={
        <>
          <FiltersSecondaryRow>
            <FilterUserField
              value={filter.responsible}
              placeholder={t({ scope: "filters", name: "responsible_user", parameter: "placeholder" })}
              onChange={filter.setResponsible}
            />
            <FilterCheckboxField
              value={filter.showArchived}
              title={t({ scope: "filters", name: "show_archived", parameter: "title" })}
              onChange={filter.setShowArchived}
            />
          </FiltersSecondaryRow>
        </>
      }
    />
  );
}

export default observer(ProjectsListFilters);
