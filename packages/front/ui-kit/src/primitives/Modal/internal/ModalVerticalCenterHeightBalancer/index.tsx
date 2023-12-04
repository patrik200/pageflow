import React from "react";

import { verticalCenterHeightBalancerStyles } from "./style.css";

function ModalVerticalCenterHeightBalancer() {
  return <div className={verticalCenterHeightBalancerStyles} />;
}

export default React.memo(ModalVerticalCenterHeightBalancer);
