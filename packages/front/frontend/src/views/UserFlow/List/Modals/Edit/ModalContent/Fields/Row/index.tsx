import React, { Fragment } from "react";
import { observer } from "mobx-react-lite";
import { Button, Checkbox, DraggableListComponentInterface, Icon, TextField } from "@app/ui-kit";
import { getErrorMessageWithCommonIntl, useTranslation } from "@app/front-kit";

import { EditUserFlowRowEntity } from "core/storages/user-flow/entities/EditUserFlow";

import UserFlowFieldsRowUser from "./UserRow";
import UserFlowFieldsRowSeparator from "./Separator";

import {
  actionsStyles,
  buttonsStyles,
  contentWrapper,
  deleteRowButtonStyles,
  dragIconStyles,
  nameFieldStyles,
  titleRowWrapper,
  usersListWrapperStyles,
  wrapperStyles,
} from "./style.css";

export interface UserFlowFieldsRowInterface {
  valueKey: string;
  entity: EditUserFlowRowEntity;
  canDelete: boolean;
  onDelete: (entity: EditUserFlowRowEntity) => void;
}

function UserFlowFieldsRow({
  value: { entity, canDelete, onDelete },
  dragProvider,
}: DraggableListComponentInterface<UserFlowFieldsRowInterface>) {
  const { t } = useTranslation("user-flow");

  const handleDelete = React.useCallback(() => onDelete(entity), [entity, onDelete]);

  return (
    <div ref={dragProvider.innerRef} className={wrapperStyles} {...dragProvider.draggableProps}>
      <div {...dragProvider.dragHandleProps}>
        <Icon className={dragIconStyles} icon="draggable" />
      </div>
      <div className={contentWrapper}>
        <div className={titleRowWrapper}>
          <TextField
            className={nameFieldStyles}
            required
            placeholder={t({
              scope: "edit_user_flow_modal",
              place: "row",
              name: "name_field",
              parameter: "placeholder",
            })}
            value={entity.name}
            errorMessage={getErrorMessageWithCommonIntl(entity.viewErrors.name, t)}
            onChangeInput={entity.setName}
          />
        </div>
        {entity.users.length !== 0 && (
          <div className={usersListWrapperStyles}>
            {entity.users.map((user, key) => (
              <Fragment key={key}>
                <UserFlowFieldsRowUser
                  entity={user}
                  canDelete={entity.users.length > 1}
                  onDelete={entity.deleteUserByValue}
                />
                {key !== entity.users.length - 1 && <UserFlowFieldsRowSeparator mode={entity.mode} />}
              </Fragment>
            ))}
          </div>
        )}
        <div className={actionsStyles}>
          <Checkbox value={entity.forbidNextRowsApproving} onChange={entity.setForbidNextRowsApproving}>
            {t({
              scope: "edit_user_flow_modal",
              place: "row",
              name: "actions",
              parameter: "forbid_next_row_approving",
            })}
          </Checkbox>
          <div className={buttonsStyles}>
            <Button size="SMALL" disabled={!entity.canAddOrMode} onClick={entity.addUserOrMode}>
              {t({ scope: "edit_user_flow_modal", place: "row", name: "actions", parameter: "add_mode_or" })}
            </Button>
            <Button size="SMALL" disabled={!entity.canAddAndMode} onClick={entity.addUserAndMode}>
              {t({ scope: "edit_user_flow_modal", place: "row", name: "actions", parameter: "add_mode_and" })}
            </Button>
          </div>
        </div>
      </div>
      <Button
        className={deleteRowButtonStyles}
        disabled={!canDelete}
        type="WITHOUT_BORDER"
        iconLeft="deleteBinLine"
        onClick={handleDelete}
      />
    </div>
  );
}

export default observer(UserFlowFieldsRow);
