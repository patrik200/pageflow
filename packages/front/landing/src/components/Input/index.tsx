import React from "react";
import { observer } from "mobx-react-lite";

import Typography from "components/Typography";

import { errorStyles, inputStyles, inputWrapperStyles, titleStyles, wrapperStyles } from "./style.css";

interface InputInterface {
  title: string;
  value: string;
  leftItem?: React.ReactNode;
  rightItem?: React.ReactNode;
  errorMessage?: string;
  onChangeInput: (value: string) => void;
}

function Input({ value, title, leftItem, rightItem, errorMessage, onChangeInput }: InputInterface) {
  const handleChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => onChangeInput(event.target.value),
    [onChangeInput],
  );

  return (
    <div className={wrapperStyles}>
      <Typography className={titleStyles}>{title}</Typography>
      <div className={inputWrapperStyles}>
        {leftItem}
        <input className={inputStyles} value={value} onInput={handleChange} />
        {rightItem}
      </div>
      {errorMessage && <Typography className={errorStyles}>{errorMessage}</Typography>}
    </div>
  );
}

export default observer(Input);
