import React from "react";
import { observer } from "mobx-react-lite";
import { Checkbox, TextFieldWrapper, Typography } from "@app/ui-kit";
import { getErrorMessageWithCommonIntl, useTranslation } from "@app/front-kit";

import FormFieldWrapper, { FormFieldWrapperDirection } from "../Wrapper";

import { textFieldStyles, valueStyles } from "../Text/style.css";

type PropsEditPart = { edit: true; disabled?: boolean; errorMessage?: string; onChange: (value: boolean) => void };

type FormFieldCheckboxInterface = {
  direction?: FormFieldWrapperDirection;
  title: string;
  value: boolean;
  required?: boolean;
  placeholder: string;
} & (PropsEditPart | { view: true });

function FormFieldCheckbox({ direction, title, value, required, placeholder, ...props }: FormFieldCheckboxInterface) {
  const { t } = useTranslation();

  return (
    <FormFieldWrapper title={title} direction={direction} required={required} mode="view">
      {"edit" in props ? (
        <TextFieldWrapper
          className={textFieldStyles}
          errorMessage={getErrorMessageWithCommonIntl(props.errorMessage, t)}
        >
          <Checkbox disabled={props.disabled} value={value} onChange={props.onChange}>
            {placeholder}
          </Checkbox>
        </TextFieldWrapper>
      ) : (
        <Typography className={valueStyles}>{placeholder}</Typography>
      )}
    </FormFieldWrapper>
  );
}

export default observer(FormFieldCheckbox);
