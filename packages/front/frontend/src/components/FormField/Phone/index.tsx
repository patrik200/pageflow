import React from "react";
import { observer } from "mobx-react-lite";
import { formatPhoneNumberWithLibPhoneNumber, PhoneField } from "@app/ui-kit";
import { getErrorMessageWithCommonIntl, useTranslation } from "@app/front-kit";

import { Link } from "components/Link";

import FormFieldWrapper, { FormFieldWrapperDirection } from "../Wrapper";
import { FormFieldTextEmptyView, getFormFieldTextEmpty } from "../Text";

import { textFieldStyles, valueStyles } from "../Text/style.css";

type FormFieldPhoneInterface = {
  direction?: FormFieldWrapperDirection;
  title?: string;
  value: string;
  required?: boolean;
} & (
  | { edit: true; placeholder?: string; errorMessage?: string; disabled?: boolean; onChange: (value: string) => void }
  | { view: true }
);

function FormFieldPhone({ direction, title, value, required, ...props }: FormFieldPhoneInterface) {
  const { t } = useTranslation();
  const phone = React.useMemo(() => (value ? formatPhoneNumberWithLibPhoneNumber(value) : null), [value]);

  return (
    <FormFieldWrapper title={title} direction={direction} required={required} mode={"edit" in props ? "edit" : "view"}>
      {"edit" in props ? (
        <PhoneField
          className={textFieldStyles}
          required={title ? false : required}
          materialPlaceholder={false}
          disabled={props.disabled}
          placeholder={props.placeholder ?? getFormFieldTextEmpty(t)}
          value={value}
          errorMessage={getErrorMessageWithCommonIntl(props.errorMessage, t)}
          onChangeInput={props.onChange}
        />
      ) : phone ? (
        <Link className={valueStyles} linkTheme="external" href={`tel:${value}`}>
          {phone}
        </Link>
      ) : (
        <FormFieldTextEmptyView />
      )}
    </FormFieldWrapper>
  );
}

export default observer(FormFieldPhone);
