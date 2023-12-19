import React from "react";
import { Image } from "@app/front-kit";
import { observer } from "mobx-react-lite";
import { scrollToElement } from "@app/ui-kit";

import Typography from "components/Typography";

import {
  tryButtonInfoTextStyles,
  contentStyles,
  contentWrapperStyles,
  logoImageStyles,
  logoTextStyles,
  logoWrapperStyles,
  titleDocumentsTextStyles,
  titleStyles,
  titleSystemTextStyles,
  tryButtonStyles,
  tryFreeWrapperStyles,
  wrapperStyles,
  tryFreeDividerStyles,
  tryButtonHighlightTextStyles,
  tryButtonShadowStyles,
  tryFreeSpacingStyles,
  tryButtonTextStyles,
} from "./style.css";

function MainBanner() {
  const handleClick = React.useCallback(() => {
    scrollToElement(window, { scrollToElement: document.getElementById("request_form")!, mode: "top" });
  }, []);

  return (
    <div className={wrapperStyles}>
      <div className={contentWrapperStyles}>
        <div className={logoWrapperStyles}>
          <Image className={logoImageStyles} src="/icons/logo.svg" preload />
          <Typography className={logoTextStyles}>PageFlow</Typography>
        </div>
        <div className={contentStyles}>
          <Typography className={titleSystemTextStyles}>СИСТЕМА</Typography>
          <Typography className={titleStyles}>УПРАВЛЕНИЯ</Typography>
          <Typography className={titleDocumentsTextStyles}>ДОКУМЕНТАМИ</Typography>
          <div className={tryFreeWrapperStyles}>
            <div className={tryFreeSpacingStyles}>
              <button className={tryButtonStyles} onClick={handleClick}>
                <div className={tryButtonTextStyles}>Попробуйте бесплатно</div>
                <div className={tryButtonShadowStyles} />
              </button>
            </div>
            <div className={tryFreeDividerStyles} />
            <div className={tryFreeSpacingStyles}>
              <Typography className={tryButtonInfoTextStyles}>
                1 МЕСЯЦ ТЕСТОВОГО ПЕРИОДА{" "}
                <Typography className={tryButtonHighlightTextStyles}>БЕЗ ОГРАНИЧЕНИЙ</Typography>
              </Typography>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default observer(MainBanner);
