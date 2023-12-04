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

interface CorrespondenceCreatedInterface {
  frontendHost: string;
  name: string;
  id: string;
  authorName: string;
  createdAt: string;
}

function CorrespondenceCreated({ frontendHost, name, id, authorName, createdAt }: CorrespondenceCreatedInterface) {
  const intlDate = useIntlDate();
  const link = `${frontendHost}/correspondences/${id}`;

  return (
    <Wrapper maxWidth="768px" frontendHost={frontendHost}>
      <div className={wrapperStyles}>
        <Header />
        <div className={bodyWrapperStyles}>
          <div className={titleTextStyles}>Создана новая корреспонденция</div>
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
              <a href={link} className={textStyles}>
                {link}
              </a>
            </div>
          </div>
          <LinkButton href={link}>Перейти к корреспонденции</LinkButton>
        </div>
        <Footer />
      </div>
    </Wrapper>
  );
}

export default React.memo(CorrespondenceCreated);
