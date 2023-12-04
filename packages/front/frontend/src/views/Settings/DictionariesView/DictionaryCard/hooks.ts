import React from "react";
import { useTranslation, useViewContext } from "@app/front-kit";
import { useAsyncFn } from "@worksolutions/react-utils";

import { emitRequestError } from "core/emitRequest";

import { DictionaryEntity } from "core/entities/dictionary/dictionary";

import { DictionariesControlStorage } from "core/storages/dictionary/control";

export function useReorder(dictionary: DictionaryEntity) {
  const { t } = useTranslation("settings");

  const { reorderValues } = useViewContext().containerInstance.get(DictionariesControlStorage);
  const [{ loading }, asyncReorderValues] = useAsyncFn(reorderValues, [reorderValues]);

  const handleReorder = React.useCallback(
    async (newOrder: string[]) => {
      const result = await asyncReorderValues(dictionary.id, newOrder);
      if (result.success) return;

      emitRequestError(
        undefined,
        result.error,
        t({ scope: "tab_dictionaries", place: "reorder", name: "error_messages", parameter: "unexpected" }),
      );
    },
    [asyncReorderValues, dictionary.id, t],
  );

  return [loading, handleReorder] as const;
}
