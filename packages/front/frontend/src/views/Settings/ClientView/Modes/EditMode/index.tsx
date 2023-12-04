import React from "react";
import { observer } from "mobx-react-lite";
import { useTranslation, useViewContext } from "@app/front-kit";
import { Button } from "@app/ui-kit";
import { useAsyncFn } from "@worksolutions/react-utils";

import Divider from "components/Divider";
import FormFieldText from "components/FormField/Text";
import GroupedContent from "components/FormField/GroupedContent";

import { emitRequestError, emitRequestSuccess } from "core/emitRequest";

import { EditClientEntity } from "core/storages/client/entities/EditClient";

import { ClientCommonStorage } from "core/storages/client/client-common";

import { actionsWrapperStyles } from "./style.css";

interface EditModeInterface {
  disableEditMode: () => void;
}

function EditMode({ disableEditMode }: EditModeInterface) {
  const { t } = useTranslation("settings");
  const { client, updateCurrentClient } = useViewContext().containerInstance.get(ClientCommonStorage);

  const entity = React.useMemo(() => EditClientEntity.buildFromClientEntity(client), [client]);

  const handleSave = React.useCallback(async () => {
    const result = await updateCurrentClient(entity);
    if (result.success) {
      emitRequestSuccess(t({ scope: "tab_client", place: "edit", name: "success_message" }));
      disableEditMode();
      return;
    }

    emitRequestError(
      entity,
      result.error,
      t({ scope: "tab_client", place: "edit", name: "error_messages", parameter: "unexpected" }),
    );
  }, [disableEditMode, entity, t, updateCurrentClient]);

  const [{ loading }, asyncHandleSave] = useAsyncFn(handleSave, [handleSave]);

  const handleSaveClick = React.useCallback(
    () => entity.submit({ onSuccess: asyncHandleSave }),
    [asyncHandleSave, entity],
  );

  return (
    <>
      <GroupedContent>
        <FormFieldText
          edit
          disabled={loading}
          required
          title={t({ scope: "tab_client", place: "name_field", name: "title" })}
          value={entity.name}
          errorMessage={entity.viewErrors.name}
          onChange={entity.setName}
        />
      </GroupedContent>
      <Divider />
      <div className={actionsWrapperStyles}>
        <Button type="OUTLINE" disabled={loading} onClick={disableEditMode}>
          {t({ scope: "tab_client", place: "edit", name: "actions", parameter: "cancel" })}
        </Button>
        <Button loading={loading} onClick={handleSaveClick}>
          {t({ scope: "tab_client", place: "edit", name: "actions", parameter: "save" })}
        </Button>
      </div>
    </>
  );
}

export default observer(EditMode);
