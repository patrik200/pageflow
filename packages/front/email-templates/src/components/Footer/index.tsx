import React from "react";

import { footerEmailTextStyles, footerWrapperStyles } from "./style.css";

function MessageFooter() {
  return (
    <div className={footerWrapperStyles}>
      <div className={footerEmailTextStyles}>info@pageflow.ru</div>
    </div>
  );
}

export default React.memo(MessageFooter);
