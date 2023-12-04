import React from "react";
import { observer } from "mobx-react-lite";
import { scrollToElement } from "@app/ui-kit";

import Typography from "components/Typography";

import {
  buttonInfoTextStyles,
  circleStyles,
  contentStyles,
  descriptionStyles,
  titleStyles,
  tryButtonStyles,
  wrapperStyles,
} from "./style.css";

function MainBanner() {
  const handleClick = React.useCallback(() => {
    scrollToElement(window, { scrollToElement: document.getElementById("request_form")!, mode: "top" });
  }, []);

  return (
    <div className={wrapperStyles}>
      <div className={circleStyles} />
      <div className={contentStyles}>
        <Typography className={titleStyles}>Система управления документами</Typography>
        <Typography className={descriptionStyles}>
          Оптимизируйте процесс создания, организации и обмена технической документацией с помощью PageFlow.
        </Typography>
        <button className={tryButtonStyles} onClick={handleClick}>
          Попробуйте бесплатно
        </button>
        <Typography className={buttonInfoTextStyles}>1 месяц тестового периода • Без ограничений</Typography>
      </div>
    </div>
  );
}

export default observer(MainBanner);
