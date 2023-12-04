import React from "react";
import { observer } from "mobx-react-lite";
import { Typography } from "@app/ui-kit";

import Logo from "components/Logo";

import {
  contentContainer,
  contentWrapperStyle,
  formContainer,
  logoStyles,
  rootWrapperStyle,
  titleStyles,
} from "./style.css";

interface AuthPageWrapperInterface {
  children: React.ReactNode;
  title: string;
}

function AuthPageWrapper({ children, title }: AuthPageWrapperInterface) {
  return (
    <div className={rootWrapperStyle}>
      <div className={contentWrapperStyle}>
        <Logo className={logoStyles} />
        <div className={contentContainer}>
          <Typography className={titleStyles}>{title}</Typography>
          <div className={formContainer}>{children}</div>
        </div>
      </div>
    </div>
  );
}

export default observer(AuthPageWrapper);
