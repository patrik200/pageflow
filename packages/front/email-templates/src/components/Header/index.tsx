import React from "react";

import { ReactComponent as LogoIcon } from "icons/logo.svg";

import { headerTextStyles, headerWrapperStyles } from "./style.css";

function MessageHeader() {
  return (
    <div className={headerWrapperStyles}>
      <LogoIcon />
      <div className={headerTextStyles}>Page Flow</div>
    </div>
  );
}

export default React.memo(MessageHeader);
