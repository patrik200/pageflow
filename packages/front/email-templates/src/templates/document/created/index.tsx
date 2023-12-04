import React from "react";
import { DateMode } from "@worksolutions/utils";
import { DateTime } from "luxon";

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

import Wrapper, { useIntlDate } from "../../__Wrapper";

interface DocumentCreatedInterface {
  frontendHost: string;
  name: string;
  id: string;
  authorName: string;
  createdAt: string;
}

function DocumentCreated({ frontendHost, name, id, authorName, createdAt }: DocumentCreatedInterface) {
  const link = `${frontendHost}/documents/${id}`;
  const intlDate = useIntlDate();

  return (
    <Wrapper maxWidth="768px" frontendHost={frontendHost}>
      <div className={wrapperStyles}>
        <Header />
        <div className={bodyWrapperStyles}>
          <div className={titleTextStyles}>Создан новый документ</div>
          <div className={infoColumnsWrapperStyles}>
            <div className={leftInfoColumnStyles}>
              <div className={lightTextStyles}>Название:</div>
              <div className={lightTextStyles}>Автор:</div>
              <div className={lightTextStyles}>Дата создания:</div>
              <div className={lightTextStyles}>Ссылка:</div>
            </div>
            <div className={rightInfoColumnStyles}>
              <div className={textStyles}>{name}</div>
              <div className={textStyles}>{authorName}</div>
              <div className={textStyles}>
                {intlDate.formatDate(DateTime.fromISO(createdAt), DateMode.DATE_TIME_WITH_STRING_MONTH)}
              </div>
              <div className={textStyles}>{link}</div>
            </div>
          </div>
          <LinkButton href={link}>Перейти к документу</LinkButton>
        </div>
        <Footer />
      </div>
    </Wrapper>
  );
}

export default React.memo(DocumentCreated);
