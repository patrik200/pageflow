import React from "react";
import { observer } from "mobx-react-lite";

import MenuLinks from "./Links";
import MenuLogo from "./Logo";
import MenuUser from "./User";

import { menuWrapperStyles } from "./style.css";

function PageWrapperMenu() {
  return (
    <div className={menuWrapperStyles}>
      <MenuLogo />
      <MenuLinks />
      <MenuUser />
    </div>
  );
}

export default observer(PageWrapperMenu);
