import React from "react";
import { observer } from "mobx-react-lite";
import { getErrorMessageWithCommonIntl, useTranslation, useViewContext } from "@app/front-kit";
import { ModalActions, ModalTitle, SelectField, SelectFieldOption, TextField } from "@app/ui-kit";
import { useAsyncFn } from "@worksolutions/react-utils";

import { emitRequestError } from "core/emitRequest";

import { MoveToReturnStatusEntity } from "core/storages/document/entities/revision/MoveToReturnStatusEntity";

import { DocumentRevisionsStorage } from "core/storages/document/revisions";
import { DictionariesCommonStorage } from "core/storages/dictionary/common";

import { wrapperStyles, contentWrapperStyles } from "./style.css";

interface MoveToReturnModalContentInterface {
  onClose: () => void;
}

function MoveToReturnModalContent({ onClose }: MoveToReturnModalContentInterface) {
  const { t } = useTranslation("document-revision-detail");
  const { containerInstance } = useViewContext();
  const { documentRevisionReturnCodeDictionary } = containerInstance.get(DictionariesCommonStorage);

  const returnCodeOptions = React.useMemo<SelectFieldOption<string | null>[]>(
    () => documentRevisionReturnCodeDictionary.values.map(({ key, value }) => ({ value: key, label: value })),
    [documentRevisionReturnCodeDictionary.values],
  );

  const entity = React.useMemo(() => MoveToReturnStatusEntity.buildEmpty(), []);
  const { moveToReturnStatus } = containerInstance.get(DocumentRevisionsStorage);

  const handleReturnRevision = React.useCallback(async () => {
    const result = await moveToReturnStatus(entity);
    if (result.success) {
      onClose();
      return;
    }

    emitRequestError(
      entity,
      result.error,
      t({ scope: "view_revision", name: "change_status_errors", parameter: "unexpected" }),
    );
  }, [entity, moveToReturnStatus, onClose, t]);

  const [{ loading }, asyncHandleReturnRevision] = useAsyncFn(handleReturnRevision, [handleReturnRevision]);

  const handleReturnClick = React.useCallback(
    () => entity.submit({ onSuccess: asyncHandleReturnRevision }),
    [asyncHandleReturnRevision, entity],
  );

  return (
    <div className={wrapperStyles}>
      <ModalTitle>{t({ scope: "view_revision", place: "move_to_return_modal", name: "title" })}</ModalTitle>
      <div className={contentWrapperStyles}>
        <SelectField
          required
          value={entity.code}
          placeholder={t({
            scope: "view_revision",
            place: "move_to_return_modal",
            name: "return_code_field",
            parameter: "placeholder",
          })}
          strategy="fixed"
          searchable
          searchPlaceholder={t({ scope: "common:common_form_fields", place: "select", name: "search_placeholder" })}
          emptyListText={t({ scope: "common:common_form_fields", place: "select", name: "empty_list" })}
          options={returnCodeOptions}
          errorMessage={getErrorMessageWithCommonIntl(entity.viewErrors.code, t)}
          onChange={entity.setCode}
        />
        <TextField
          textArea
          rows={5}
          value={entity.message}
          placeholder={t({
            scope: "view_revision",
            place: "move_to_return_modal",
            name: "return_message_field",
            parameter: "placeholder",
          })}
          errorMessage={getErrorMessageWithCommonIntl(entity.viewErrors.message, t)}
          onChangeInput={entity.setMessage}
        />
      </div>
      <ModalActions
        primaryActionText={t({ scope: "view_revision", place: "move_to_return_modal", name: "action" })}
        primaryActionLoading={loading}
        onPrimaryActionClick={handleReturnClick}
      />
    </div>
  );
}

export default observer(MoveToReturnModalContent);
