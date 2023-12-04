import React from "react";
import { observer } from "mobx-react-lite";
import { useTranslation, useViewContext } from "@app/front-kit";
import { SelectFieldOption } from "@app/ui-kit";
import { TicketPriorities } from "@app/shared-enums";

import Filters, { FiltersSecondaryRow } from "components/Filters";
import FilterSearchTextField from "components/Filters/pressets/FilterSearchTextField";
import FilterCheckboxField from "components/Filters/pressets/FilterCheckboxField";
import FilterSelectField from "components/Filters/pressets/FilterSelectField";

import { DictionariesCommonStorage } from "core/storages/dictionary/common";
import { TicketsStorage } from "core/storages/ticket";

import { useUserSelectOptions } from "../TicketDetailModal/ModalContent/ContentModes/Edit/commonHooks";

import { typeSelectPopupStyles } from "./style.css";

interface TicketsFiltersInterface {
  loading: boolean;
}

function TicketsFilters({ loading }: TicketsFiltersInterface) {
  const { t } = useTranslation();
  const { filter } = useViewContext().containerInstance.get(TicketsStorage);
  const { ticketStatusDictionary, ticketTypeDictionary } =
    useViewContext().containerInstance.get(DictionariesCommonStorage);

  const typeSelectOptions = React.useMemo<SelectFieldOption<string | null>[]>(
    () => [
      { value: null, label: t({ scope: "common:common_form_fields", place: "select", name: "none_value" }) },
      ...ticketTypeDictionary.values.map(({ key, value }) => ({ value: key, label: value })),
    ],
    [ticketTypeDictionary.values, t],
  );
  const statusSelectOptions = React.useMemo<SelectFieldOption<string | null>[]>(
    () => [
      { value: null, label: t({ scope: "common:common_form_fields", place: "select", name: "none_value" }) },
      ...ticketStatusDictionary.values.map(({ key, value }) => ({ value: key, label: value })),
    ],
    [ticketStatusDictionary.values, t],
  );
  const priotitySelectOptions = React.useMemo<SelectFieldOption<TicketPriorities | null>[]>(
    () => [
      { value: null, label: t({ scope: "common:common_form_fields", place: "select", name: "none_value" }) },
      ...Object.values(TicketPriorities).map((priority) => ({
        value: priority,
        label: t({ scope: "common:kanban", place: "ticket_priorities", name: priority }),
      })),
    ],
    [t],
  );

  const authorSelectOptions = useUserSelectOptions();
  const customerSelectOptions = useUserSelectOptions();
  const responsibleSelectOptions = useUserSelectOptions();

  return (
    <Filters
      primaryRow={
        <>
          <FilterSearchTextField
            loading={loading}
            value={filter.search}
            placeholder={t({ scope: "kanban", place: "filters", name: "search" })}
            onChangeInput={filter.setSearch}
          />
          <FilterCheckboxField
            value={filter.searchInAttachments}
            title={t({ scope: "kanban", place: "filters", name: "search_in_attachments" })}
            onChange={filter.setSearchInAttachments}
          />
        </>
      }
      secondaryRow={
        <>
          <FiltersSecondaryRow>
            <FilterSelectField
              options={authorSelectOptions}
              placeholder={t({ scope: "kanban", place: "filters", name: "author_field" })}
              value={filter.author}
              onChange={filter.setAuthor}
            />
            <FilterSelectField
              desktopPopupClassName={typeSelectPopupStyles}
              popupWidth="auto"
              value={filter.priority}
              placeholder={t({ scope: "kanban", place: "filters", name: "priority_field" })}
              searchPlaceholder={t({ scope: "common:common_form_fields", place: "select", name: "search_placeholder" })}
              emptyListText={t({ scope: "common:common_form_fields", place: "select", name: "empty_list" })}
              options={priotitySelectOptions}
              onChange={filter.setPriority}
            />
            <FilterSelectField
              desktopPopupClassName={typeSelectPopupStyles}
              popupWidth="auto"
              value={filter.type}
              placeholder={t({ scope: "kanban", place: "filters", name: "type_field" })}
              searchPlaceholder={t({ scope: "common:common_form_fields", place: "select", name: "search_placeholder" })}
              emptyListText={t({ scope: "common:common_form_fields", place: "select", name: "empty_list" })}
              options={typeSelectOptions}
              onChange={filter.setType}
            />
            {filter.presentationType !== "kanban" && (
              <FilterSelectField
                desktopPopupClassName={typeSelectPopupStyles}
                popupWidth="auto"
                value={filter.status}
                placeholder={t({ scope: "kanban", place: "filters", name: "status_field" })}
                searchPlaceholder={t({
                  scope: "common:common_form_fields",
                  place: "select",
                  name: "search_placeholder",
                })}
                emptyListText={t({ scope: "common:common_form_fields", place: "select", name: "empty_list" })}
                options={statusSelectOptions}
                onChange={filter.setStatus}
              />
            )}
          </FiltersSecondaryRow>
          <FiltersSecondaryRow>
            <FilterSelectField
              options={customerSelectOptions}
              placeholder={t({ scope: "kanban", place: "filters", name: "customer_field" })}
              value={filter.customer}
              onChange={filter.setCustomer}
            />
            <FilterSelectField
              options={responsibleSelectOptions}
              placeholder={t({ scope: "kanban", place: "filters", name: "responsible_field" })}
              value={filter.responsible}
              onChange={filter.setResponsible}
            />
            <FilterCheckboxField
              value={filter.showArchived}
              title={t({ scope: "kanban", place: "filters", name: "show_archived" })}
              onChange={filter.setShowArchived}
            />
          </FiltersSecondaryRow>
        </>
      }
    />
  );
}

export default observer(TicketsFilters);
