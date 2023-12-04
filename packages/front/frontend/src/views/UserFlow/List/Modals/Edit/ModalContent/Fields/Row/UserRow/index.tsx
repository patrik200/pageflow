import React from "react";
import { observer } from "mobx-react-lite";
import { getErrorMessageWithCommonIntl, useTranslation } from "@app/front-kit";
import { Button, SelectField, TextField } from "@app/ui-kit";

import { useAllUsersSelectFieldOptions } from "components/FormField/UserSelect";

import { EditUserFlowRowUserEntity } from "core/storages/user-flow/entities/EditUserFlow";

import { deleteButtonStyles, descriptionStyles, titleRowWrapper, userFieldStyles, wrapperStyles } from "./style.css";

interface UserFlowFieldsRowUserInterface {
  entity: EditUserFlowRowUserEntity;
  canDelete: boolean;
  onDelete: (entity: EditUserFlowRowUserEntity) => void;
}

function UserFlowFieldsRowUser({ entity, canDelete, onDelete }: UserFlowFieldsRowUserInterface) {
  const { t } = useTranslation("user-flow");
  const userOptions = useAllUsersSelectFieldOptions(false);

  const handleDelete = React.useCallback(() => onDelete(entity), [entity, onDelete]);

  return (
    <div className={wrapperStyles}>
      <div className={titleRowWrapper}>
        <SelectField
          className={userFieldStyles}
          materialPlaceholder={false}
          required
          dots
          options={userOptions}
          placeholder={t({
            scope: "edit_user_flow_modal",
            place: "row",
            name: "user_user_field",
            parameter: "placeholder",
          })}
          value={entity.id}
          errorMessage={getErrorMessageWithCommonIntl(entity.viewErrors.id, t)}
          onChange={entity.setId}
        />
      </div>
      <TextField
        className={descriptionStyles}
        textArea
        rows={3}
        materialPlaceholder={false}
        placeholder={t({
          scope: "edit_user_flow_modal",
          place: "row",
          name: "user_description_field",
          parameter: "placeholder",
        })}
        value={entity.description}
        errorMessage={getErrorMessageWithCommonIntl(entity.viewErrors.description, t)}
        onChangeInput={entity.setDescription}
      />
      <Button
        className={deleteButtonStyles}
        disabled={!canDelete}
        type="WITHOUT_BORDER"
        iconLeft="deleteBinLine"
        onClick={handleDelete}
      />
    </div>
  );
}

export default observer(UserFlowFieldsRowUser);
