import React from "react";
import { observer } from "mobx-react-lite";
import { useTranslation } from "@app/front-kit";
import { AttributeCategory } from "@app/shared-enums";

import Filters, { FiltersSecondaryRow } from "components/Filters";
import FilterSearchTextField from "components/Filters/pressets/FilterSearchTextField";
import FilterCheckboxField from "components/Filters/pressets/FilterCheckboxField";
import FilterAttributesField from "components/Filters/pressets/FilterAttributesField";
import FilterUserField from "components/Filters/pressets/FilterUserField";

import { CorrespondenceFilterEntity } from "core/storages/correspondence/entities/correspondence/CorrespondenceFilter";

interface CorrespondencesFiltersInterface {
  loading: boolean;
  filter: CorrespondenceFilterEntity;
}

function CorrespondencesFilters({ loading, filter }: CorrespondencesFiltersInterface) {
  const { t } = useTranslation("correspondence-list");

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
          <FilterCheckboxField
            value={filter.searchInRevisionAttachments}
            title={t({ scope: "filters", name: "search_in_attachments", parameter: "title" })}
            onChange={filter.setSearchInRevisionAttachments}
          />
        </>
      }
      secondaryRow={
        <>
          <FiltersSecondaryRow>
            <FilterUserField
              value={filter.author}
              placeholder={t({ scope: "filters", name: "author", parameter: "placeholder" })}
              onChange={filter.setAuthor}
            />
            <FilterCheckboxField
              value={filter.showArchived}
              title={t({ scope: "filters", name: "show_archived", parameter: "title" })}
              onChange={filter.setShowArchived}
            />
          </FiltersSecondaryRow>
          <FiltersSecondaryRow>
            <FilterAttributesField
              title={t({ scope: "filters", place: "attributes", name: "title" })}
              attributes={filter.attributes}
              category={AttributeCategory.CORRESPONDENCE}
              onCreate={filter.addAttribute}
              onDelete={filter.deleteAttributeByIndex}
            />
          </FiltersSecondaryRow>
        </>
      }
    />
  );
}

export default observer(CorrespondencesFilters);
