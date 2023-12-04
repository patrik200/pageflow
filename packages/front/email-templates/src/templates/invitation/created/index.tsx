import React from "react";
import { DateMode } from "@worksolutions/utils";
import { DateTime } from "luxon";

import Header from "components/Header";
import Footer from "components/Footer";
import LinkButton from "components/LinkButton";

import {
  bodyWrapperStyles,
  titleTextStyles,
  wrapperStyles,
  infoColumnsWrapperStyles,
  leftInfoColumnStyles,
  rightInfoColumnStyles,
  lightTextStyles,
  textStyles,
} from "templates/coreStyles.css";

import Wrapper, { useIntlDate } from "../../__Wrapper";

export interface InvitationCreatedInterface {
  frontendHost: string;
  token: string;
  invitationExpiresAt: string;
}

function InvitationCreated({ frontendHost, token, invitationExpiresAt }: InvitationCreatedInterface) {
  const intlDate = useIntlDate();

  const invitationLink = `${frontendHost}/invitations/${token}`;

  return (
    <Wrapper maxWidth="768px" frontendHost={frontendHost}>
      <div className={wrapperStyles}>
        <Header />
        <div className={bodyWrapperStyles}>
          <div className={titleTextStyles}>Вы приглашены в PageFlow!</div>
          <div className={titleTextStyles}>Для завершения регистрации перейдите по ссылке, нажав на кнопку</div>

          <div className={infoColumnsWrapperStyles}>
            <div className={leftInfoColumnStyles}>
              <div className={lightTextStyles}>Дата истечения приглашения:</div>
            </div>
            <div className={rightInfoColumnStyles}>
              <div className={textStyles}>
                {intlDate.formatDate(DateTime.fromISO(invitationExpiresAt), DateMode.DATE_TIME_WITH_STRING_MONTH)}
              </div>
            </div>
          </div>
          <LinkButton href={invitationLink}>Принять приглашение</LinkButton>
        </div>
        <Footer />
      </div>
    </Wrapper>
  );
}

export default React.memo(InvitationCreated);
