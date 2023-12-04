import React from "react";
import { observer } from "mobx-react-lite";
import { getErrorMessageWithCommonIntl, useTranslation } from "@app/front-kit";
import {
  Button,
  SingleColumnDraggableList,
  TextField,
  Checkbox,
  Typography,
  MaskedField,
  SelectField,
} from "@app/ui-kit";
import { useObservableAsDeferredMemo } from "@worksolutions/react-utils";

import { FormFieldTextItemRight } from "components/FormField/Text";
import { useAllUsersSelectFieldOptions } from "components/FormField/UserSelect";

import { createIntMask } from "core/defaultMask";

import { EditUserFlowEntity } from "core/storages/user-flow/entities/EditUserFlow";

import UserFlowFieldsRow, { UserFlowFieldsRowInterface } from "./Row";

import { addRowActionStyles, includeWeekendsErrorStyle, wrapperStyles } from "./style.css";

interface UserFlowFieldsInterface {
  entity: EditUserFlowEntity;
}

function UserFlowFields({ entity }: UserFlowFieldsInterface) {
  const { t } = useTranslation("user-flow");
  const handleAddRow = React.useCallback(() => entity.addEmptyRow(), [entity]);

  const userOptions = useAllUsersSelectFieldOptions(true);

  const rows = useObservableAsDeferredMemo(
    (rows): UserFlowFieldsRowInterface[] =>
      rows.map((row) => ({
        valueKey: row._virtualId,
        entity: row,
        canDelete: entity.canDelete,
        onDelete: entity.deleteRowByValue,
      })),
    [entity.canDelete, entity.deleteRowByValue],
    entity.rows,
  );

  return (
    <div className={wrapperStyles}>
      <TextField
        required
        placeholder={t({ scope: "edit_user_flow_modal", place: "name_field", name: "placeholder" })}
        value={entity.name}
        errorMessage={getErrorMessageWithCommonIntl(entity.viewErrors.name, t)}
        onChangeInput={entity.setName}
      />
      <div>
        <Checkbox value={entity.deadlineDaysIncludeWeekends} onChange={entity.setDeadlineDaysIncludeWeekends}>
          {t({ scope: "edit_user_flow_modal", place: "include_weekend_field", name: "placeholder" })}
        </Checkbox>
        {entity.viewErrors.deadlineDaysIncludeWeekends !== undefined && (
          <Typography className={includeWeekendsErrorStyle}>
            {getErrorMessageWithCommonIntl(entity.viewErrors.deadlineDaysIncludeWeekends, t)}
          </Typography>
        )}
      </div>
      <MaskedField
        fieldItemRight={
          entity.deadlineDaysAmount === "" ? undefined : (
            <FormFieldTextItemRight
              text={t({ scope: "common:time", name: "days_pure" }, { count: parseInt(entity.deadlineDaysAmount) })}
            />
          )
        }
        mask={createIntMask(3)}
        placeholder={t({ scope: "edit_user_flow_modal", place: "deadline_days_field", name: "placeholder" })}
        value={entity.deadlineDaysAmount}
        onChangeInput={entity.setDeadlineDaysAmount}
        errorMessage={getErrorMessageWithCommonIntl(entity.viewErrors.rows, t)}
      />
      {rows.length !== 0 && (
        <SingleColumnDraggableList
          list={rows}
          Component={UserFlowFieldsRow}
          itemKey="valueKey"
          onNewOrder={entity.reoderRows}
        />
      )}
      <Button className={addRowActionStyles} onClick={handleAddRow}>
        {t({ scope: "edit_user_flow_modal", name: "row_list_actions", parameter: "add_row" })}
      </Button>
      <SelectField
        materialPlaceholder
        dots
        options={userOptions}
        placeholder={t({
          scope: "edit_user_flow_modal",
          place: "user_reviewer_field",
          name: "placeholder",
        })}
        value={entity.reviewerId}
        errorMessage={getErrorMessageWithCommonIntl(entity.viewErrors.id, t)}
        onChange={entity.setReviewerId}
      />
    </div>
  );
}

export default observer(UserFlowFields);
