import React from "react";
import { observer } from "mobx-react-lite";
import { Typography } from "@app/ui-kit";
import { getErrorMessageWithCommonIntl, useTranslation } from "@app/front-kit";

import TextEditor from "components/TextEditor";

import FormFieldWrapper, { FormFieldWrapperDirection } from "../Wrapper";
import { FormFieldTextEmptyView, getFormFieldTextEmpty } from "../Text";

import { textFieldStyles, valueStyles } from "./style.css";

type FormFieldTextEditorInterface = {
  required?: boolean;
  direction?: FormFieldWrapperDirection;
  title: string;
  value: string;
} & (
  | {
      edit: true;
      placeholder?: string;
      errorMessage?: string;
      disabled?: boolean;
      rows?: number;
      onChange: (value: string) => void;
    }
  | { view: true }
);

function FormFieldTextEditor({ required, direction, title, value, ...props }: FormFieldTextEditorInterface) {
  const { t } = useTranslation();

  return (
    <FormFieldWrapper required={required} title={title} direction={direction} mode={"edit" in props ? "edit" : "view"}>
      {"edit" in props ? (
        <TextEditor
          className={textFieldStyles}
          disabled={props.disabled}
          placeholder={props.placeholder ?? getFormFieldTextEmpty(t)}
          initialHTML={value}
          onChange={props.onChange}
          onAddImage={() => {}}
          errorMessage={getErrorMessageWithCommonIntl(props.errorMessage, t)}
        />
      ) : value ? (
        <Typography asHTML className={valueStyles}>
          {value}
        </Typography>
      ) : (
        <FormFieldTextEmptyView />
      )}
    </FormFieldWrapper>
  );
}

export default observer(FormFieldTextEditor);
