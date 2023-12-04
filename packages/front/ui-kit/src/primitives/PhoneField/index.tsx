import React from "react";

import TextField, { TextFieldInterface } from "primitives/TextField";
import { MaskParserConfigInterface } from "primitives/MaskedField";

import { ComponentWithRef } from "types";

import PhoneInput from "./PhoneInput";

export type PhoneFieldInterface = Omit<TextFieldInterface, "onChange"> &
  Pick<MaskParserConfigInterface, "maskCharacter">;

function PhoneField({ onChangeInput, ...props }: PhoneFieldInterface, ref: React.Ref<HTMLDivElement>) {
  const phoneInput = React.useMemo(
    () =>
      React.forwardRef((props: Record<string, any>, ref: React.Ref<any>) => (
        <PhoneInput ref={ref} {...props} onChangeInput={onChangeInput} />
      )),
    [onChangeInput],
  );

  return <TextField {...props} ref={ref} as={phoneInput} />;
}

export default React.memo(React.forwardRef(PhoneField)) as ComponentWithRef<PhoneFieldInterface, HTMLDivElement>;
