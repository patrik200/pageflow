import React from "react";
import { observer } from "mobx-react-lite";
import { Spinner } from "@app/ui-kit";

import CardTitlePreset from "../CardTitle";

import { spinnerStyles } from "./style.css";

interface CardLoadingPresetInterface {
  className?: string;
  title?: string;
  actions?: React.ReactNode;
}

function CardLoadingPreset({ className, title, actions }: CardLoadingPresetInterface) {
  return (
    <CardTitlePreset className={className} title={title} actions={actions}>
      <Spinner className={spinnerStyles} />
    </CardTitlePreset>
  );
}

export default observer(CardLoadingPreset);
