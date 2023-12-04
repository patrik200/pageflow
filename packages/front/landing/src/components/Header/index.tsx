import React from "react";
import { observer } from "mobx-react-lite";
import { Image } from "@app/front-kit";

import Typography from "components/Typography";

import { contentStyles, logoImageStyles, logoTextStyles, wrapperStyles } from "./style.css";

function Header() {
  return (
    <div className={wrapperStyles}>
      <div className={contentStyles}>
        <Image className={logoImageStyles} src="/icons/logo.svg" preload />
        <Typography className={logoTextStyles}>PageFlow</Typography>
      </div>
    </div>
  );
}

export default observer(Header);
