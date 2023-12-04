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

interface TicketUpdatedInterface {
  frontendHost: string;
  name: string;
  id: string;
  updatedAt: string;
}

function TicketUpdated({ frontendHost, name, id, updatedAt }: TicketUpdatedInterface) {
  const intlDate = useIntlDate();
  const link = `${frontendHost}/tickets/${id}`;

  return (
    <Wrapper maxWidth="768px" frontendHost={frontendHost}>
      <div className={wrapperStyles}>
        <Header />
        <div className={bodyWrapperStyles}>
          <div className={titleTextStyles}>Обновление запроса</div>
          <div className={infoColumnsWrapperStyles}>
            <div className={leftInfoColumnStyles}>
              <div className={lightTextStyles}>Название:</div>
              <div className={lightTextStyles}>Дата создания:</div>
              <div className={lightTextStyles}>Ссылка:</div>
            </div>
            <div className={rightInfoColumnStyles}>
              <div className={textStyles}>{name}</div>
              <div className={textStyles}>
                {intlDate.formatDate(DateTime.fromISO(updatedAt), DateMode.DATE_TIME_WITH_STRING_MONTH)}
              </div>
              <a href={link} className={textStyles}>
                {link}
              </a>
            </div>
          </div>
          <LinkButton href={link}>Перейти к запросу</LinkButton>
        </div>
        <Footer />
      </div>
    </Wrapper>
  );
}

export default React.memo(TicketUpdated);
