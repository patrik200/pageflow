import React from "react";

import Typography from "components/Typography";

import CheckIcon from "./CheckIcon";

import { iconWrapperStyles, wrapperStyles, checkboxWrapperStyles, errorStyles } from "./style.css";

interface CheckboxInterface {
  value: boolean;
  onChange: (value: boolean) => void;
  children?: React.ReactNode;
  errorMessage?: string;
}

function Checkbox({ value, onChange, children, errorMessage }: CheckboxInterface) {
  const handleValueChange = React.useCallback(() => onChange(!value), [onChange, value]);
  return (
    <div>
      <div onClick={handleValueChange} className={wrapperStyles}>
        <div className={checkboxWrapperStyles}>{value && <CheckIcon className={iconWrapperStyles} />}</div>
        {children}
      </div>
      {errorMessage && <Typography className={errorStyles}>{errorMessage}</Typography>}
    </div>
  );
}

export default React.memo(Checkbox);
