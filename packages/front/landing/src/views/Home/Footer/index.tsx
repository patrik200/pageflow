import React from "react";
import { observer } from "mobx-react-lite";
import cn from "classnames";

import Typography from "components/Typography";

import {
  footerContentWrapperStyles,
  footerTextMarginStyles,
  footerTextStyles,
  footerTitleStyles,
  footerWrapperStyles,
  linkWrapperStyles,
} from "./style.css";

function Footer() {
  return (
    <div className={footerWrapperStyles}>
      <div className={footerContentWrapperStyles}>
        <div className={linkWrapperStyles}>
          <Typography className={footerTitleStyles}>Навигация</Typography>
          <a className={footerTextStyles} href="/privacy" target="_blank">
            Политика конфиденциальности персональных данных
          </a>
          <a className={footerTextStyles} href="/terms" target="_blank">
            Лицензионное соглашение
          </a>
        </div>
        <div className={linkWrapperStyles}>
          <Typography className={footerTitleStyles}>Поддержка</Typography>
          <Typography>
            <a href="mailto:info@pageflow.ru" className={footerTextStyles}>
              info@pageflow.ru
            </a>
          </Typography>
          <Typography>
            <a href="tel:+79897165796" className={footerTextStyles}>
              +7 (989) 716-57-96
            </a>
          </Typography>
          <Typography className={cn(footerTextStyles, footerTextMarginStyles)}>ИНН 614089368930</Typography>
        </div>
      </div>
    </div>
  );
}

export default observer(Footer);
