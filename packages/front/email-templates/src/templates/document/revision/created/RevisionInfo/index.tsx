import React from "react";
import { DateMode } from "@worksolutions/utils";
import { DateTime } from "luxon";

import LinkButton from "components/LinkButton";

import { useIntlDate } from "templates/__Wrapper";
import {
  titleTextStyles,
  infoColumnsWrapperStyles,
  leftInfoColumnStyles,
  rightInfoColumnStyles,
  lightTextStyles,
  textStyles,
} from "templates/coreStyles.css";

interface RevisionInfoInterface {
  number: string;
  link: string;
  authorName: string;
  createdAt: string;
  responsibleUserName: string | null;
  responsibleUserFlowName: string | null;
}

function RevisionInfo({
  number,
  link,
  authorName,
  createdAt,
  responsibleUserName,
  responsibleUserFlowName,
}: RevisionInfoInterface) {
  const intlDate = useIntlDate();

  return (
    <>
      <div className={titleTextStyles}>Создана новая ревизия</div>
      <div className={infoColumnsWrapperStyles}>
        <div className={leftInfoColumnStyles}>
          <div className={lightTextStyles}>Номер:</div>
          <div className={lightTextStyles}>Автор:</div>
          <div className={lightTextStyles}>Дата создания:</div>
          {responsibleUserName && <div className={lightTextStyles}>Ответственный:</div>}
          {responsibleUserFlowName && <div className={lightTextStyles}>Маршрут документа:</div>}
          <div className={lightTextStyles}>Ссылка:</div>
        </div>
        <div className={rightInfoColumnStyles}>
          <div className={textStyles}>{number}</div>
          <div className={textStyles}>{authorName}</div>
          <div className={textStyles}>
            {intlDate.formatDate(DateTime.fromISO(createdAt), DateMode.DATE_TIME_WITH_STRING_MONTH)}
          </div>
          {responsibleUserName && <div className={textStyles}>{responsibleUserName}</div>}
          {responsibleUserFlowName && <div className={textStyles}>{responsibleUserFlowName}</div>}
          <a href={link} className={textStyles}>
            {link}
          </a>
        </div>
      </div>
      <LinkButton href={link}>Перейти к ревизии</LinkButton>
    </>
  );
}

export default React.memo(RevisionInfo);
