import React from "react";

import { Spinner } from "main";

import {
  spinnerExtraStyles,
  spinnerLargeStyles,
  spinnerMediumStyles,
  spinnerSmallStyles,
  wrapperStyles,
} from "./style.css";

export function SpinnerDemo() {
  return (
    <div className={wrapperStyles}>
      <Spinner className={spinnerSmallStyles} />
      <Spinner className={spinnerMediumStyles} />
      <Spinner className={spinnerLargeStyles} />
      <Spinner className={spinnerExtraStyles} />
    </div>
  );
}
