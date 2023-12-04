import React from "react";
import { observer } from "mobx-react-lite";
import { getErrorMessageWithCommonIntl, useTranslation, useViewContext } from "@app/front-kit";
import { ModalActions, ModalTitle, TextField } from "@app/ui-kit";
import { useAsyncFn } from "@worksolutions/react-utils";

import { emitRequestError } from "core/emitRequest";

import { DictionaryEntity, DictionaryValueEntity } from "core/entities/dictionary/dictionary";
import { EditDictionaryValueEntity } from "core/storages/dictionary/entities/EditDictionaryValue";

import { DictionariesControlStorage } from "core/storages/dictionary/control";

import { contentStyles } from "./style.css";

interface UpdateDictionaryValueModalContentInterface {
  dictionary: DictionaryEntity;
  value?: DictionaryValueEntity;
  close: () => void;
}

function UpdateDictionaryValueModalContent({ dictionary, value, close }: UpdateDictionaryValueModalContentInterface) {
  const { t } = useTranslation("settings");
  const entity = React.useMemo(
    () =>
      value
        ? EditDictionaryValueEntity.buildFromDictionaryValueEntity(dictionary, value)
        : EditDictionaryValueEntity.buildEmptyEntity(dictionary),
    [dictionary, value],
  );

  const { createValue, editValue } = useViewContext().containerInstance.get(DictionariesControlStorage);

  const handleSaveValue = React.useCallback(async () => {
    const result = value ? await editValue(entity) : await createValue(entity);
    if (result.success) {
      close();
      return;
    }

    emitRequestError(
      undefined,
      result.error,
      t({ scope: "tab_dictionaries", place: "update_value_modal", name: "error_messages", parameter: "unexpected" }),
    );
  }, [close, createValue, editValue, entity, t, value]);

  const [{ loading }, asyncHandleSaveValue] = useAsyncFn(handleSaveValue, [handleSaveValue]);

  const handleSaveClick = React.useCallback(
    () => entity.submit({ onSuccess: asyncHandleSaveValue }),
    [asyncHandleSaveValue, entity],
  );

  return (
    <>
      <ModalTitle>
        {t({
          scope: "tab_dictionaries",
          place: "update_value_modal",
          name: "title",
          parameter: value ? "edit" : "create",
        })}
      </ModalTitle>
      <div className={contentStyles}>
        <TextField
          required
          placeholder={t({
            scope: "tab_dictionaries",
            place: "update_value_modal",
            name: "key_field",
            parameter: "placeholder",
          })}
          disabled={!!value}
          value={entity.key}
          errorMessage={getErrorMessageWithCommonIntl(entity.viewErrors.key, t)}
          onChangeInput={entity.setKey}
        />
        <TextField
          required
          placeholder={t({
            scope: "tab_dictionaries",
            place: "update_value_modal",
            name: "value_field",
            parameter: "placeholder",
          })}
          value={entity.value}
          errorMessage={getErrorMessageWithCommonIntl(entity.viewErrors.value, t)}
          onChangeInput={entity.setValue}
        />
      </div>
      <ModalActions
        primaryActionText={t({
          scope: "tab_dictionaries",
          place: "update_value_modal",
          name: "actions",
          parameter: "save",
        })}
        primaryActionLoading={loading}
        onPrimaryActionClick={handleSaveClick}
      />
    </>
  );
}

export default observer(UpdateDictionaryValueModalContent);
