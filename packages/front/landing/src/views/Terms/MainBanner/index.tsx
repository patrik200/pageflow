import React from "react";
import { observer } from "mobx-react-lite";

import Typography from "components/Typography";

import { circleStyles, contentStyles, titleStyles, wrapperStyles } from "./style.css";

function MainBanner() {
  return (
    <div className={wrapperStyles}>
      <div className={circleStyles} />
      <div className={contentStyles}>
        <Typography className={titleStyles}>Лицензионное соглашение</Typography>
      </div>
    </div>
  );
}

export default observer(MainBanner);
