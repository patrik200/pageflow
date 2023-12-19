import React from "react";
import { scrollToElement } from "@app/ui-kit";

import Typography from "components/Typography";

import {
  bannerWrapperStyles,
  buttonStyles,
  contentStyles,
  titleTextStyles,
  tryWrapperShadowStyles,
  tryWrapperStyles,
  underButtonTextStyles,
} from "./style.css";

function Banner() {
  const handleClick = React.useCallback(() => {
    scrollToElement(window, { scrollToElement: document.getElementById("request_form")!, mode: "top" });
  }, []);

  return (
    <div className={bannerWrapperStyles}>
      <div className={contentStyles}>
        <Typography className={titleTextStyles}>ОПТИМИЗИРУЙТЕ ПРОЦЕСС ВЕДЕНИЯ ДОКУМЕНТАЦИИ С PAGEFLOW</Typography>
        <div className={tryWrapperStyles}>
          <div className={tryWrapperShadowStyles} />
          <button className={buttonStyles} onClick={handleClick}>
            Попробуйте бесплатно
          </button>
          <Typography className={underButtonTextStyles}>1 МЕСЯЦ ТЕСТОВОГО ПЕРИОДА БЕЗ ОГРАНИЧЕНИЙ!</Typography>
        </div>
      </div>
    </div>
  );
}

export default React.memo(Banner);
