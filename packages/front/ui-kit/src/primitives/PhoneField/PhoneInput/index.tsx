import React from "react";
import { omit } from "@worksolutions/utils";
import ReactPhoneInput from "react-phone-number-input";

import { useInternalPhoneInput } from "./libs";

import { phoneInputStyles } from "./style.css";

type PhoneInputInterface = {
  value: string;
  onChangeInput: (value: string) => void;
} & Record<string, any>;

function PhoneInput(
  { className, value: valueProp, onChangeInput, ...props }: PhoneInputInterface,
  ref: React.Ref<any>,
) {
  const [value, handleChange] = useInternalPhoneInput(valueProp, onChangeInput);

  return (
    <ReactPhoneInput
      ref={ref}
      {...(omit(["fieldType", "error"], props) as any)}
      smartCaret
      value={value}
      type="tel"
      numberInputProps={numberInputProps}
      countrySelectComponent={countrySelectComponent}
      international
      className={className}
      limitMaxLength
      onChange={handleChange}
    />
  );
}

const numberInputProps = { className: phoneInputStyles };

export default React.memo(React.forwardRef(PhoneInput));

const countrySelectComponent = () => null;
