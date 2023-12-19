import React from "react";
import { observer } from "mobx-react-lite";

import Typography from "components/Typography";

import { subTitleStyles, titleStyles, wrapperStyles } from "./style.css";

function FeaturesTitle() {
  return (
    <div className={wrapperStyles}>
      <Typography className={titleStyles}>ОСНОВНЫЕ ФУНКЦИОНАЛЬНЫЕ</Typography>
      <Typography className={subTitleStyles}>ВОЗМОЖНОСТИ</Typography>
    </div>
  );
}

export default observer(FeaturesTitle);
