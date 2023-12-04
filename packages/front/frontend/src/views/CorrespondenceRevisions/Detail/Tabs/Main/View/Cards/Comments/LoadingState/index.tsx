import React from "react";
import { observer } from "mobx-react-lite";
import { Spinner } from "@app/ui-kit";

import { spinnerStyles, spinnerWrapperStyles } from "./style.css";

function LoadingState() {
  return (
    <div className={spinnerWrapperStyles}>
      <Spinner className={spinnerStyles} />
    </div>
  );
}

export default observer(LoadingState);
