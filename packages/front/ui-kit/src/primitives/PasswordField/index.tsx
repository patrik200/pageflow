import React from "react";
import { useToggle } from "@worksolutions/react-utils";

import TextField, { TextFieldInterface } from "primitives/TextField";
import Icon from "primitives/Icon";

import { iconStyles } from "./style.css";

type PasswordFieldInterface = Omit<TextFieldInterface, "fieldItemRight" | "type" | "focusOnInputFieldClick">;

function PasswordField(props: PasswordFieldInterface, ref: React.Ref<HTMLDivElement>) {
  const [opened, toggleOpened] = useToggle(false);
  return (
    <TextField
      ref={ref}
      {...props}
      type={opened ? "text" : "password"}
      fieldItemRight={<Icon className={iconStyles} icon={opened ? "eyeOnLine" : "eyeOffLine"} onClick={toggleOpened} />}
    />
  );
}

export default React.memo(React.forwardRef(PasswordField)) as React.ForwardRefRenderFunction<
  HTMLDivElement,
  PasswordFieldInterface
>;
