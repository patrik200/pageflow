import React from "react";
import { observer } from "mobx-react-lite";
import { useTranslation, useViewContext } from "@app/front-kit";
import { ModalActions, ModalTitle } from "@app/ui-kit";
import { useAsyncFn } from "@worksolutions/react-utils";

import GroupedContent from "components/FormField/GroupedContent";

import { DocumentRevisionsStorage } from "../../../../../../../core/storages/document/revisions";
import { ProlongApprovingDateEntity } from "../../../../../../../core/storages/document/entities/revision/ProlongApprovingDateEntity";
import { emitRequestError, emitRequestSuccess } from "../../../../../../../core/emitRequest";
import FormFieldDate from "../../../../../../../components/FormField/Date";

interface DocumentRevisionProlongApprovingDateModalContentInterface {
  close: () => void;
}

function DocumentRevisionProlongApprovingDateModalContent({
  close,
}: DocumentRevisionProlongApprovingDateModalContentInterface) {
  const { t } = useTranslation("document-revision-detail");

  const { containerInstance } = useViewContext();

  const { revisionDetail, prolongApprovingDate } = containerInstance.get(DocumentRevisionsStorage);

  const entity = React.useMemo(() => ProlongApprovingDateEntity.buildEmpty(revisionDetail!.id), [revisionDetail]);

  const handleProlongApprovingDate = React.useCallback(async () => {
    const result = await prolongApprovingDate(entity);

    if (result.success) {
      emitRequestSuccess(t({ scope: "prolong_approving_date_modal", name: "success_message" }));
      close();
      return;
    }

    emitRequestError(
      entity,
      result.error,
      t({ scope: "prolong_approving_date_modal", place: "error_messages", name: "unexpected" }),
    );
  }, [close, entity, prolongApprovingDate, t]);

  const [{ loading }, asyncHandleProlongApprovingDate] = useAsyncFn(handleProlongApprovingDate, [
    handleProlongApprovingDate,
  ]);

  const handleProlongApprovingDateClick = React.useCallback(
    () => entity.submit({ onSuccess: asyncHandleProlongApprovingDate }),
    [asyncHandleProlongApprovingDate, entity],
  );

  return (
    <>
      <ModalTitle>{t({ scope: "prolong_approving_date_modal", name: "title" })}</ModalTitle>
      <GroupedContent size="extra">
        <FormFieldDate
          edit
          materialPlaceholder
          value={entity.approvingDeadline}
          placeholder={t({ scope: "prolong_approving_date_modal", place: "date_field", name: "placeholder" })}
          errorMessage={entity.viewErrors.approvingDeadline}
          minValue={revisionDetail!.approvingDeadlineNextDay}
          onChange={entity.setApprovingDeadline}
        />
      </GroupedContent>
      <ModalActions
        primaryActionLoading={loading}
        primaryActionText={t({ scope: "prolong_approving_date_modal", place: "actions", name: "submit" })}
        onPrimaryActionClick={handleProlongApprovingDateClick}
      />
    </>
  );
}

export default observer(DocumentRevisionProlongApprovingDateModalContent);
