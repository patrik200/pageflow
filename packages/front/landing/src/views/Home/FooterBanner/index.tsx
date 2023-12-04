import React from "react";
import { observer } from "mobx-react-lite";
import { scrollToElement } from "@app/ui-kit";

import Typography from "components/Typography";

import { buttonInfoTextStyles, contentStyles, titleStyles, tryButtonStyles, wrapperStyles } from "./style.css";

function FooterBanner() {
  const handleClick = React.useCallback(() => {
    scrollToElement(window, { scrollToElement: document.getElementById("request_form")!, mode: "top" });
  }, []);

  return (
    <div className={wrapperStyles}>
      <div className={contentStyles}>
        <Typography className={titleStyles}>Оптимизируйте процесс ведения документации с PageFlow</Typography>
        <button className={tryButtonStyles} onClick={handleClick}>
          Попробуйте бесплано
        </button>
        <Typography className={buttonInfoTextStyles}>1 месяц тестового периода • Без ограничений</Typography>
      </div>
    </div>
  );
}

export default observer(FooterBanner);
