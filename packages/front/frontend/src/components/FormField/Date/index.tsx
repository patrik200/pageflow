import React from "react";
import { observer } from "mobx-react-lite";
import { DatePickerField, Typography } from "@app/ui-kit";
import { getErrorMessageWithCommonIntl, useTranslation, useViewContext } from "@app/front-kit";
import { DateMode } from "@worksolutions/utils";
import { DateTime } from "luxon";

import { IntlDateStorage } from "core/storages/intl-date";

import FormFieldWrapper, { FormFieldWrapperDirection } from "../Wrapper";
import { FormFieldTextEmptyView, getFormFieldTextEmpty } from "../Text";

import { textFieldStyles, valueStyles } from "../Text/style.css";

type FormFieldDateEditPart = {
  edit: true;
  materialPlaceholder?: boolean;
  minValue?: Date | null;
  maxValue?: Date | null;
  placeholder?: string;
  errorMessage?: string;
  disabled?: boolean;
  onChange: (value: Date | null) => void;
};

type FormFieldDateInterface = {
  direction?: FormFieldWrapperDirection;
  title?: string;
  value: Date | null;
} & (FormFieldDateEditPart | { view: true; dateMode: DateMode; postValue?: React.ReactNode });

function FormFieldDate({ direction, title, value, ...props }: FormFieldDateInterface) {
  const { t } = useTranslation();
  const { getIntlDate } = useViewContext().containerInstance.get(IntlDateStorage);
  const intlDate = React.useMemo(() => getIntlDate(), [getIntlDate]);
  const dateTime = React.useMemo(() => (value ? DateTime.fromJSDate(value) : null), [value]);
  const minDateTime = React.useMemo(
    () =>
      (props as FormFieldDateEditPart).minValue
        ? DateTime.fromJSDate((props as FormFieldDateEditPart).minValue!)
        : null,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [(props as FormFieldDateEditPart).minValue],
  );
  const maxDateTime = React.useMemo(
    () =>
      (props as FormFieldDateEditPart).maxValue
        ? DateTime.fromJSDate((props as FormFieldDateEditPart).maxValue!)
        : null,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [(props as FormFieldDateEditPart).maxValue],
  );

  const handleChange = React.useCallback(
    (newValue: string) => {
      (props as FormFieldDateEditPart).onChange(
        newValue === "" ? null : intlDate.getDateTime(newValue, DateMode.DATE).toJSDate(),
      );
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [(props as FormFieldDateEditPart).onChange],
  );
  return (
    <FormFieldWrapper title={title} direction={direction} mode={"edit" in props ? "edit" : "view"}>
      {"edit" in props ? (
        <DatePickerField
          className={textFieldStyles}
          strategy="fixed"
          materialPlaceholder={props.materialPlaceholder ?? false}
          disabled={props.disabled}
          placeholder={props.placeholder ?? getFormFieldTextEmpty(t)}
          value={dateTime ? intlDate.formatDate(dateTime, DateMode.DATE) : undefined}
          mode={DateMode.DATE}
          minDate={minDateTime ? intlDate.formatDate(minDateTime, DateMode.DATE) : undefined}
          maxDate={maxDateTime ? intlDate.formatDate(maxDateTime, DateMode.DATE) : undefined}
          errorMessage={getErrorMessageWithCommonIntl(props.errorMessage, t)}
          onChangeInput={handleChange}
        />
      ) : dateTime ? (
        <Typography className={valueStyles}>
          {intlDate.formatDate(dateTime, props.dateMode)}
          {props.postValue}
        </Typography>
      ) : (
        <FormFieldTextEmptyView />
      )}
    </FormFieldWrapper>
  );
}

export default observer(FormFieldDate);
