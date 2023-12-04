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

interface ProjectEndDateNotifiedInterface {
  frontendHost: string;
  name: string;
  id: string;
  deadlineAt: string;
}

function ProjectEndDateNotified({ frontendHost, name, id, deadlineAt }: ProjectEndDateNotifiedInterface) {
  const intlDate = useIntlDate();
  const link = `${frontendHost}/projects/${id}`;

  return (
    <Wrapper maxWidth="768px" frontendHost={frontendHost}>
      <div className={wrapperStyles}>
        <Header />
        <div className={bodyWrapperStyles}>
          <div className={titleTextStyles}>Приближается дата планового завершения проекта</div>
          <div className={infoColumnsWrapperStyles}>
            <div className={leftInfoColumnStyles}>
              <div className={lightTextStyles}>Название:</div>
              <div className={lightTextStyles}>Плановая дата завершения:</div>
              <div className={lightTextStyles}>Ссылка:</div>
            </div>
            <div className={rightInfoColumnStyles}>
              <div className={textStyles}>{name}</div>
              <div className={textStyles}>
                {intlDate.formatDate(DateTime.fromISO(deadlineAt), DateMode.DATE_WITH_STRING_MONTH)}
              </div>
              <a href={link} className={textStyles}>
                {link}
              </a>
            </div>
          </div>
          <LinkButton href={link}>Перейти к проекту</LinkButton>
        </div>
        <Footer />
      </div>
    </Wrapper>
  );
}

export default React.memo(ProjectEndDateNotified);
