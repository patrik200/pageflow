import React from "react";
import { observer } from "mobx-react-lite";
import { useTranslation, useViewContext } from "@app/front-kit";
import { ModalActions, ModalTitle, SelectField, SelectFieldOption } from "@app/ui-kit";
import { useAsyncFn, useObservableAsDeferredMemo } from "@worksolutions/react-utils";

import { emitRequestError } from "core/emitRequest";

import { DictionaryEntity, DictionaryValueEntity } from "core/entities/dictionary/dictionary";

import { DictionariesControlStorage } from "core/storages/dictionary/control";

import { wrapperStyles } from "./style.css";

interface DeleteDictionaryValueModalContentInterface {
  dictionary: DictionaryEntity;
  value: DictionaryValueEntity;
  close: () => void;
}

function DeleteDictionaryValueModalContent({ dictionary, value, close }: DeleteDictionaryValueModalContentInterface) {
  const { t } = useTranslation("settings");

  const { deleteValue } = useViewContext().containerInstance.get(DictionariesControlStorage);

  const [replaceWith, setReplaceWith] = React.useState<string | null>(null);
  const replaceWithSelectOptions = useObservableAsDeferredMemo(
    (values: DictionaryValueEntity[]): SelectFieldOption<string>[] =>
      values
        .filter((dictionaryValue) => dictionaryValue.key !== value.key)
        .map((dictionaryValue) => ({
          value: dictionaryValue.key,
          label: dictionaryValue.value,
          secondaryLabel: dictionaryValue.key,
        })),
    [value.key],
    dictionary.values,
  );

  const handleDeleteValue = React.useCallback(async () => {
    const result = await deleteValue(dictionary.id, value, replaceWith);
    if (result.success) {
      close();
      return;
    }

    emitRequestError(
      undefined,
      result.error,
      t({ scope: "tab_dictionaries", place: "delete_value_modal", name: "error_messages", parameter: "unexpected" }),
    );
  }, [close, deleteValue, dictionary.id, replaceWith, t, value]);

  const [{ loading }, asyncHandleDeleteValue] = useAsyncFn(handleDeleteValue, [handleDeleteValue]);

  const handleDeleteClick = React.useCallback(() => asyncHandleDeleteValue(), [asyncHandleDeleteValue]);

  return (
    <>
      <div className={wrapperStyles}>
        <ModalTitle>
          {t({ scope: "tab_dictionaries", place: "delete_value_modal", name: "title" }, { value: value.value })}
        </ModalTitle>
        <SelectField
          required={dictionary.required}
          strategy="fixed"
          value={replaceWith}
          options={replaceWithSelectOptions}
          searchable
          placeholder={t({
            scope: "tab_dictionaries",
            place: "delete_value_modal",
            name: "replace_with_field",
            parameter: "placeholder",
          })}
          searchPlaceholder={t({
            scope: "tab_dictionaries",
            place: "delete_value_modal",
            name: "replace_with_field",
            parameter: "search_placeholder",
          })}
          emptyListText={t({
            scope: "tab_dictionaries",
            place: "delete_value_modal",
            name: "replace_with_field",
            parameter: "empty_list",
          })}
          onChange={setReplaceWith}
        />
      </div>
      <ModalActions
        primaryActionText={t({
          scope: "tab_dictionaries",
          place: "delete_value_modal",
          name: "actions",
          parameter: "delete",
        })}
        primaryActionDisabled={dictionary.required ? !replaceWith : false}
        primaryActionLoading={loading}
        onPrimaryActionClick={handleDeleteClick}
      />
    </>
  );
}

export default observer(DeleteDictionaryValueModalContent);
