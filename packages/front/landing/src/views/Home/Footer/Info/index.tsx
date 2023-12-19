import React from "react";
import cn from "classnames";

import Typography from "components/Typography";

import UserIcon from "./icons/User";
import FileIcon from "./icons/File";
import MailIcon from "./icons/Mail";

import {
  footerContentWrapperStyles,
  footerTextStyles,
  footerTitleStyles,
  linkWrapperStyles,
  navigationItemFakeIconStyles,
  navigationItemWrapperStyles,
  navigationItemWrapperToTopMarginStyles,
} from "./style.css";

function Info() {
  return (
    <div className={footerContentWrapperStyles}>
      <div className={linkWrapperStyles}>
        <Typography className={footerTitleStyles}>НАВИГАЦИЯ</Typography>
        <div className={navigationItemWrapperStyles}>
          <UserIcon />
          <a className={footerTextStyles} href="/license" target="_blank">
            Лицензионное соглашение
          </a>
        </div>
        {/*<div className={navigationItemWrapperStyles}>*/}
        {/*  <ShieldIcon />*/}
        {/*  <a className={footerTextStyles} href="/terms" target="_blank">*/}
        {/*    Лицензионное соглашение*/}
        {/*  </a>*/}
        {/*</div>*/}
      </div>
      <div className={linkWrapperStyles}>
        <Typography className={footerTitleStyles}>ПОДДЕРЖКА</Typography>
        <div className={navigationItemWrapperStyles}>
          <MailIcon />
          <Typography>
            <a href="mailto:info@pageflow.ru" className={footerTextStyles}>
              info@pageflow.ru
            </a>
          </Typography>
        </div>
        <div className={navigationItemWrapperStyles}>
          <FileIcon />
          <Typography className={footerTextStyles}>ИНН 614089368930</Typography>
        </div>
        <div className={cn(navigationItemWrapperStyles, navigationItemWrapperToTopMarginStyles)}>
          <div className={navigationItemFakeIconStyles} />
          <Typography className={footerTextStyles}>ОГРНИП 321619600158665</Typography>
        </div>
      </div>
    </div>
  );
}

export default React.memo(Info);
