import React from "react";

import Header from "components/Header";
import Footer from "components/Footer";
import LinkButton from "components/LinkButton";

import {
  bodyWrapperStyles,
  infoColumnsWrapperStyles,
  leftInfoColumnStyles,
  lightTextStyles,
  rightInfoColumnStyles,
  textStyles,
  titleTextStyles,
  wrapperStyles,
} from "templates/coreStyles.css";

import Wrapper from "../../__Wrapper";

interface ClientCreatedInterface {
  frontendHost: string;
  adminEmail: string;
  adminPassword: string;
}

function ClientCreated({ frontendHost, adminPassword, adminEmail }: ClientCreatedInterface) {
  return (
    <Wrapper maxWidth="768px" frontendHost={frontendHost}>
      <div className={wrapperStyles}>
        <Header />
        <div className={bodyWrapperStyles}>
          <div>
            <div className={titleTextStyles}>Стенд успешно развернут!</div>
            <div className={titleTextStyles}>Данные для входа администратора</div>
          </div>
          <div className={infoColumnsWrapperStyles}>
            <div className={leftInfoColumnStyles}>
              <div className={lightTextStyles}>Логин:</div>
              <div className={lightTextStyles}>Пароль:</div>
              <div className={lightTextStyles}>Адрес:</div>
            </div>
            <div className={rightInfoColumnStyles}>
              <div className={textStyles}>{adminEmail}</div>
              <div className={textStyles}>{adminPassword}</div>
              <div className={textStyles}>{frontendHost}</div>
            </div>
          </div>
          <LinkButton href={frontendHost}>Перейти к стенду</LinkButton>
        </div>
        <Footer />
      </div>
    </Wrapper>
  );
}

export default React.memo(ClientCreated);
