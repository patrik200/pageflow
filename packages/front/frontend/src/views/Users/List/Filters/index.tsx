import React from "react";
import { observer } from "mobx-react-lite";
import { useTranslation } from "@app/front-kit";

import Filters from "components/Filters";
import FilterSearchTextField from "components/Filters/pressets/FilterSearchTextField";
import FilterCheckboxField from "components/Filters/pressets/FilterCheckboxField";

import { UsersListFiltersEntity } from "core/storages/user/entities/Filter";

interface UsersListFiltersInterface {
  entity: UsersListFiltersEntity;
  loading?: boolean;
}

function UsersListFilters({ entity, loading }: UsersListFiltersInterface) {
  const { t } = useTranslation("users-list");

  return (
    <Filters
      primaryRow={
        <>
          <FilterSearchTextField
            loading={loading}
            value={entity.search}
            placeholder={t({ scope: "filters", name: "search", parameter: "placeholder" })}
            onChangeInput={entity.setSearch}
          />
          <FilterCheckboxField
            value={entity.searchWithDeleted}
            title={t({ scope: "filters", name: "search_in_deleted", parameter: "title" })}
            onChange={entity.setSearchWithDeleted}
          />
        </>
      }
    />
  );
}

export default observer(UsersListFilters);
