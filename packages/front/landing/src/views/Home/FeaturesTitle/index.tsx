import React from "react";
import { observer } from "mobx-react-lite";

import Typography from "components/Typography";

import { titleStyles, wrapperStyles } from "./style.css";

function FeaturesTitle() {
  return (
    <div className={wrapperStyles}>
      <Typography className={titleStyles}>Основные функциональные возможности</Typography>
    </div>
  );
}

export default observer(FeaturesTitle);
