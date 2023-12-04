import React from "react";

import Footer from "components/Footer";
import Header from "components/Header";
import LinkButton from "components/LinkButton";

import { bodyWrapperStyles, titleTextStyles, wrapperStyles } from "templates/coreStyles.css";

import Wrapper from "../../__Wrapper";

interface ResetPasswordCreatedInterface {
  frontendHost: string;
  token: string;
}

function ResetPasswordCreated({ token, frontendHost }: ResetPasswordCreatedInterface) {
  const link = `${frontendHost}/auth/reset-password/finish?token=${token}`;
  return (
    <Wrapper maxWidth="768px" frontendHost={frontendHost}>
      <div className={wrapperStyles}>
        <Header />
        <div className={bodyWrapperStyles}>
          <div className={titleTextStyles}>Для восстановления пароля перейдите по ссылке, нажав на кнопку</div>
          <LinkButton href={link}>Восстановить пароль</LinkButton>
        </div>
        <Footer />
      </div>
    </Wrapper>
  );
}

export default React.memo(ResetPasswordCreated);
