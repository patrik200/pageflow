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

import Wrapper, { useIntlDate } from "../../../__Wrapper";

interface DocumentRevisionUpdatedInterface {
  frontendHost: string;
  number: string;
  id: string;
  updatedAt: string;
}

function DocumentRevisionUpdated({ frontendHost, number, id, updatedAt }: DocumentRevisionUpdatedInterface) {
  const intlDate = useIntlDate();
  const link = `${frontendHost}/document-revisions/${id}`;

  return (
    <Wrapper maxWidth="768px" frontendHost={frontendHost}>
      <div className={wrapperStyles}>
        <Header />
        <div className={bodyWrapperStyles}>
          <div className={titleTextStyles}>Ревизия документа обновлена</div>
          <div className={infoColumnsWrapperStyles}>
            <div className={leftInfoColumnStyles}>
              <div className={lightTextStyles}>Номер:</div>
              <div className={lightTextStyles}>Дата обновления:</div>
              <div className={lightTextStyles}>Ссылка:</div>
            </div>
            <div className={rightInfoColumnStyles}>
              <div className={textStyles}>{number}</div>
              <div className={textStyles}>
                {intlDate.formatDate(DateTime.fromISO(updatedAt), DateMode.DATE_TIME_WITH_STRING_MONTH)}
              </div>
              <a href={link} className={textStyles}>
                {link}
              </a>
            </div>
          </div>
          <LinkButton href={link}>Перейти к ревизии</LinkButton>
        </div>
        <Footer />
      </div>
    </Wrapper>
  );
}

export default React.memo(DocumentRevisionUpdated);
