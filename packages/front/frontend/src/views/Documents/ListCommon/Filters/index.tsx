import React from "react";
import { observer } from "mobx-react-lite";
import { useTranslation, useViewContext } from "@app/front-kit";
import { SelectFieldOption } from "@app/ui-kit";
import { AttributeCategory, DocumentRevisionStatus } from "@app/shared-enums";

import Filters, { FiltersSecondaryRow } from "components/Filters";
import FilterSearchTextField from "components/Filters/pressets/FilterSearchTextField";
import FilterCheckboxField from "components/Filters/pressets/FilterCheckboxField";
import FilterSelectField from "components/Filters/pressets/FilterSelectField";
import FilterAttributesField from "components/Filters/pressets/FilterAttributesField";
import FilterUserField from "components/Filters/pressets/FilterUserField";

import { DocumentFilterEntity } from "core/storages/document/entities/document/DocumentFilter";

import { DictionariesCommonStorage } from "core/storages/dictionary/common";

import { lastRevisionStatusSelectPopupStyles, lastRevisionStatusStyles, typeSelectPopupStyles } from "./style.css";

interface DocumentsFiltersInterface {
  loading: boolean;
  filter: DocumentFilterEntity;
}

function DocumentsFilters({ loading, filter }: DocumentsFiltersInterface) {
  const { t } = useTranslation("document-list");
  const { containerInstance } = useViewContext();
  const { documentTypeDictionary } = containerInstance.get(DictionariesCommonStorage);

  const typeSelectOptions = React.useMemo<SelectFieldOption<string | null>[]>(
    () => [
      { value: null, label: t({ scope: "common:common_form_fields", place: "select", name: "none_value" }) },
      ...documentTypeDictionary.values.map(({ key, value }) => ({ value: key, label: value })),
    ],
    [documentTypeDictionary.values, t],
  );

  const lastRevisionStatusSelectOptions = React.useMemo<SelectFieldOption<string | null>[]>(
    () => [
      { value: null, label: t({ scope: "common:common_form_fields", place: "select", name: "none_value" }) },
      {
        value: DocumentRevisionStatus.INITIAL,
        label: t({ scope: "common:document_revision_statuses", name: "initial" }),
      },
      {
        value: DocumentRevisionStatus.REVIEW,
        label: t({ scope: "common:document_revision_statuses", name: "review" }),
      },
      {
        value: DocumentRevisionStatus.RETURNED,
        label: t({ scope: "common:document_revision_statuses", name: "returned" }),
      },
      {
        value: DocumentRevisionStatus.APPROVED,
        label: t({ scope: "common:document_revision_statuses", name: "approved" }),
      },
      {
        value: DocumentRevisionStatus.REVOKED,
        label: t({ scope: "common:document_revision_statuses", name: "revoked" }),
      },
    ],
    [t],
  );

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
            <FilterSelectField
              desktopPopupClassName={typeSelectPopupStyles}
              searchable
              popupWidth="auto"
              value={filter.type}
              placeholder={t({ scope: "filters", name: "type", parameter: "placeholder" })}
              searchPlaceholder={t({ scope: "common:common_form_fields", place: "select", name: "search_placeholder" })}
              emptyListText={t({ scope: "common:common_form_fields", place: "select", name: "empty_list" })}
              options={typeSelectOptions}
              onChange={filter.setType}
            />
            <FilterSelectField
              className={lastRevisionStatusStyles}
              desktopPopupClassName={lastRevisionStatusSelectPopupStyles}
              searchable
              popupWidth="auto"
              value={filter.lastRevisionStatus}
              placeholder={t({ scope: "filters", name: "last_revision_status", parameter: "placeholder" })}
              searchPlaceholder={t({ scope: "common:common_form_fields", place: "select", name: "search_placeholder" })}
              emptyListText={t({ scope: "common:common_form_fields", place: "select", name: "empty_list" })}
              options={lastRevisionStatusSelectOptions}
              onChange={filter.setLastRevisionStatus}
            />
            <FilterCheckboxField
              value={filter.showArchived}
              title={t({ scope: "filters", name: "show_archived", parameter: "title" })}
              onChange={filter.setShowArchived}
            />
          </FiltersSecondaryRow>
          <FiltersSecondaryRow>
            <FilterUserField
              value={filter.author}
              placeholder={t({ scope: "filters", name: "author", parameter: "placeholder" })}
              onChange={filter.setAuthor}
            />
            <FilterUserField
              value={filter.responsible}
              placeholder={t({ scope: "filters", name: "responsible", parameter: "placeholder" })}
              onChange={filter.setResponsible}
            />
          </FiltersSecondaryRow>
          <FiltersSecondaryRow>
            <FilterAttributesField
              title={t({ scope: "filters", place: "attributes", name: "title" })}
              attributes={filter.attributes}
              category={AttributeCategory.DOCUMENT}
              onCreate={filter.addAttribute}
              onDelete={filter.deleteAttributeByIndex}
            />
          </FiltersSecondaryRow>
        </>
      }
    />
  );
}

export default observer(DocumentsFilters);
