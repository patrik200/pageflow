import React from "react";
import { observer } from "mobx-react-lite";
import { Switch, TextFieldWrapper, Typography } from "@app/ui-kit";
import { getErrorMessageWithCommonIntl, useTranslation } from "@app/front-kit";

import FormFieldWrapper, { FormFieldWrapperDirection } from "../Wrapper";

import { textFieldStyles, valueStyles } from "../Text/style.css";

type PropsEditPart = { edit: true; disabled?: boolean; errorMessage?: string; onChange: (value: boolean) => void };

type FormFieldSwitchInterface = {
  direction?: FormFieldWrapperDirection;
  title: string;
  value: boolean;
  required?: boolean;
  enabledText: string;
  disabledText?: string;
} & (PropsEditPart | { view: true });

function FormFieldSwitch({
  direction,
  title,
  value,
  required,
  enabledText,
  disabledText,
  ...props
}: FormFieldSwitchInterface) {
  const { t } = useTranslation();

  const valueText = value ? enabledText : disabledText ?? enabledText;

  return (
    <FormFieldWrapper title={title} direction={direction} required={required} mode="view">
      {"edit" in props ? (
        <TextFieldWrapper
          className={textFieldStyles}
          errorMessage={getErrorMessageWithCommonIntl(props.errorMessage, t)}
        >
          <Switch disabled={props.disabled} value={value} onChange={props.onChange}>
            {valueText}
          </Switch>
        </TextFieldWrapper>
      ) : (
        <Typography className={valueStyles}>{valueText}</Typography>
      )}
    </FormFieldWrapper>
  );
}

export default observer(FormFieldSwitch);
