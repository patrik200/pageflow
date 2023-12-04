import React from "react";
import { Icon } from "@app/ui-kit";

import { indicatorForDetailStyles, indicatorForSelectStyles, indicatorForTableStyles } from "./style.css";

export const PrivateIndicatorForTable = React.memo(function () {
  return <Icon className={indicatorForTableStyles} icon="eyeOffLine" />;
});

export const PrivateIndicatorForDetail = React.memo(function () {
  return <Icon className={indicatorForDetailStyles} icon="eyeOffLine" />;
});

export const PrivateIndicatorForSelect = React.memo(function () {
  return <Icon className={indicatorForSelectStyles} icon="eyeOffLine" />;
});
