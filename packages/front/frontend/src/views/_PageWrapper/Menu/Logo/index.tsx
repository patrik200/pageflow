import React from "react";

import Logo from "components/Logo";

import { logoStyles, logoWrapperStyles } from "./style.css";

function MenuLogo() {
  return (
    <div className={logoWrapperStyles}>
      <Logo className={logoStyles} autoScale />
    </div>
  );
}

export default React.memo(MenuLogo);
