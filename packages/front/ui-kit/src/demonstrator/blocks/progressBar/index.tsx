import React from "react";

import { ProgressBar } from "main";

import { wrapperStyles } from "./style.css";

export function ProgressBarDemo() {
  return (
    <div className={wrapperStyles}>
      <ProgressBar value={0.38} />
    </div>
  );
}
