import React from "react";
import { useTranslation } from "@app/front-kit";
import { TicketRelationTypes } from "@app/shared-enums";
import { SelectFieldOption } from "@app/ui-kit";

export function useTicketRelationTypeSelectOptions(isMainTicket: boolean) {
  const { t } = useTranslation();

  return React.useMemo<SelectFieldOption<string>[]>(
    () =>
      Object.values(TicketRelationTypes).map((type) => ({
        value: type,
        labelNoWrap: true,
        label: t({ scope: "ticket_relation", place: isMainTicket ? "main_types" : "related_types", name: type }),
      })),
    [isMainTicket, t],
  );
}
