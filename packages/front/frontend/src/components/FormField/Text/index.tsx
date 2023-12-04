import React from "react";
import { observer } from "mobx-react-lite";
import { IconOrElementType, MaskedField, TextField, Typography } from "@app/ui-kit";
import { getErrorMessageWithCommonIntl, TranslationFunction, useTranslation } from "@app/front-kit";

import FormFieldWrapper, { FormFieldWrapperDirection } from "../Wrapper";

import { editViewRightItemTextStyles, emptyValueStyles, textFieldStyles, valueStyles } from "./style.css";

type FormFieldTextInterface = {
  required?: boolean;
  direction?: FormFieldWrapperDirection;
  title?: string;
  value: string;
} & (
  | {
      fieldItemRight?: IconOrElementType;
      mask?: string;
      edit: true;
      placeholder?: string;
      errorMessage?: string;
      disabled?: boolean;
      rows?: number;
      onChange: (value: string) => void;
    }
  | { view: true }
);

function FormFieldText({ required, direction, title, value, ...props }: FormFieldTextInterface) {
  const { t } = useTranslation();

  const mode = "edit" in props ? "edit" : "view";

  if ("edit" in props) {
    const Component = props.mask ? MaskedField : TextField;

    return (
      <FormFieldWrapper required={required} title={title} direction={direction} mode={mode}>
        <Component
          className={textFieldStyles}
          required={title ? false : required}
          fieldItemRight={props.fieldItemRight}
          mask={props.mask!}
          materialPlaceholder={false}
          disabled={props.disabled}
          textArea={props.rows !== undefined}
          rows={props.rows}
          placeholder={props.placeholder ?? getFormFieldTextEmpty(t)}
          value={value}
          errorMessage={getErrorMessageWithCommonIntl(props.errorMessage, t)}
          onChangeInput={props.onChange}
        />
      </FormFieldWrapper>
    );
  }

  return (
    <FormFieldWrapper required={required} title={title} direction={direction} mode={mode}>
      {value ? <Typography className={valueStyles}>{value}</Typography> : <FormFieldTextEmptyView />}
    </FormFieldWrapper>
  );
}

export default observer(FormFieldText);

export const FormFieldTextEmptyView = React.memo(function () {
  const { t } = useTranslation();
  return <Typography className={emptyValueStyles}>{getFormFieldTextEmpty(t)}</Typography>;
});

export function getFormFieldTextEmpty(t: TranslationFunction) {
  return t({ scope: "common_form_fields", place: "text", name: "empty_value" });
}

export { valueStyles } from "./style.css";

export function FormFieldTextItemRight({ text }: { text: string }) {
  return <Typography className={editViewRightItemTextStyles}>{text}</Typography>;
}
