import React from "react";
import { observer } from "mobx-react-lite";
import { PasswordField } from "@app/ui-kit";
import { getErrorMessageWithCommonIntl, useTranslation } from "@app/front-kit";

import FormFieldWrapper, { FormFieldWrapperDirection } from "../Wrapper";
import { getFormFieldTextEmpty } from "../Text";

import { textFieldStyles } from "../Text/style.css";

type FormFieldPasswordInterface = {
  direction?: FormFieldWrapperDirection;
  title: string;
  value: string;
  required?: boolean;
} & { edit: true; placeholder?: string; errorMessage?: string; disabled?: boolean; onChange: (value: string) => void };

function FormFieldPassword({ direction, title, value, required, ...props }: FormFieldPasswordInterface) {
  const { t } = useTranslation();

  return (
    <FormFieldWrapper title={title} direction={direction} required={required} mode="edit">
      <PasswordField
        className={textFieldStyles}
        materialPlaceholder={false}
        disabled={props.disabled}
        placeholder={props.placeholder ?? getFormFieldTextEmpty(t)}
        value={value}
        errorMessage={getErrorMessageWithCommonIntl(props.errorMessage, t)}
        onChangeInput={props.onChange}
      />
    </FormFieldWrapper>
  );
}

export default observer(FormFieldPassword);
