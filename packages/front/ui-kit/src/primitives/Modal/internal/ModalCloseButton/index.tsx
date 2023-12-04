import React from "react";

import Icon from "primitives/Icon";

import { buttonStyles, iconStyles } from "./style.css";

interface ModalCloseButtonInterface {
  onClick: () => void;
}

function ModalCloseButton({ onClick }: ModalCloseButtonInterface) {
  return (
    <button className={buttonStyles} onClick={onClick}>
      <Icon className={iconStyles} icon="closeLine" />
    </button>
  );
}

export default React.memo(ModalCloseButton);
