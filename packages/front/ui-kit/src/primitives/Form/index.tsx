import React, { FormEvent } from "react";
import { preventDefault } from "@worksolutions/react-utils";

import { inputStyle } from "./style.css";

export interface FormInterface {
  className?: string;
  children: React.ReactNode;
  disabled?: boolean;
  onSubmit: (event: FormEvent) => void;
}

function Form({ className, disabled, onSubmit, ...props }: FormInterface) {
  const onSubmitProp = React.useCallback(
    (event: FormEvent) => preventDefault(disabled ? undefined : onSubmit)(event),
    [disabled, onSubmit],
  );

  return (
    <form className={className} onSubmit={onSubmitProp}>
      <input type="submit" className={inputStyle} />
      {props.children}
    </form>
  );
}

export default React.memo(Form);
