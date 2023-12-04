import React from "react";
import { observer } from "mobx-react-lite";
import {
  PopupManagerInterface,
  SelectableListValue,
  SelectField,
  SelectFieldOption,
  SelectFieldTrigger,
  SelectFieldTriggerInterface,
  useSelectFieldValue,
} from "@app/ui-kit";
import { getErrorMessageWithCommonIntl, useTranslation } from "@app/front-kit";

import FormFieldWrapper, { FormFieldWrapperDirection } from "../Wrapper";
import { FormFieldTextEmptyView, getFormFieldTextEmpty } from "../Text";

import { textFieldStyles } from "../Text/style.css";
import { viewSelectFieldTriggerStyles } from "./style.css";

type FormFieldSelectEditPart<VALUE extends SelectableListValue> = {
  CustomTrigger?: React.FC<SelectFieldTriggerInterface>;
  popupWidth?: PopupManagerInterface["popupWidth"];
  primaryPlacement?: PopupManagerInterface["primaryPlacement"];
  searchable?: boolean;
  edit: true;
  placeholder?: string;
  errorMessage?: string;
  disabled?: boolean;
  TextViewTrigger?: React.FC<SelectFieldTriggerInterface & { activeOption: SelectFieldOption<VALUE> | null }>;
  onChange: (value: VALUE) => void;
  customFieldValueText?: (value: SelectFieldOption<VALUE>) => string;
};

type FormFieldSelectInterface<VALUE extends SelectableListValue> = {
  className?: string;
  inputFieldWrapperClassName?: string;
  direction?: FormFieldWrapperDirection;
  title?: string;
  value: VALUE;
  options: SelectFieldOption<VALUE>[];
  required?: boolean;
} & (FormFieldSelectEditPart<VALUE> | { view: true });

function FormFieldSelect<VALUE extends SelectableListValue>({
  className,
  inputFieldWrapperClassName,
  direction,
  title,
  value,
  options,
  required,
  ...props
}: FormFieldSelectInterface<VALUE>) {
  const { t } = useTranslation();
  const {
    value: fieldValue,
    fieldItemLeft,
    activeOption: fieldActiveOption,
  } = useSelectFieldValue(value, options, {
    customFieldValueText: (props as FormFieldSelectEditPart<VALUE>).customFieldValueText,
  });

  const Trigger = (props as FormFieldSelectEditPart<VALUE>).TextViewTrigger || SelectFieldTrigger;

  return (
    <FormFieldWrapper
      className={className}
      title={title}
      direction={direction}
      required={required}
      mode={"edit" in props ? "edit" : "view"}
    >
      {"edit" in props ? (
        <SelectField
          className={textFieldStyles}
          inputFieldWrapperClassName={inputFieldWrapperClassName}
          dots
          strategy="fixed"
          required={title ? false : required}
          popupWidth={props.popupWidth}
          primaryPlacement={props.primaryPlacement}
          CustomTrigger={props.CustomTrigger}
          materialPlaceholder={false}
          disabled={props.disabled}
          placeholder={props.placeholder ?? getFormFieldTextEmpty(t)}
          value={value}
          options={options}
          errorMessage={getErrorMessageWithCommonIntl(props.errorMessage, t)}
          searchable={props.searchable}
          searchPlaceholder={t({ scope: "common:common_form_fields", place: "select", name: "search_placeholder" })}
          emptyListText={t({ scope: "common:common_form_fields", place: "select", name: "empty_list" })}
          onChange={props.onChange}
        />
      ) : fieldActiveOption ? (
        <Trigger
          className={viewSelectFieldTriggerStyles}
          inputFieldWrapperClassName={inputFieldWrapperClassName}
          fieldValue={fieldValue}
          fieldItemLeft={fieldItemLeft}
          fieldItemRight={<span />}
          activeOption={fieldActiveOption}
        />
      ) : (
        <FormFieldTextEmptyView />
      )}
    </FormFieldWrapper>
  );
}

export default observer(FormFieldSelect);
