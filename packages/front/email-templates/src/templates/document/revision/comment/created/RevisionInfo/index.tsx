import React from "react";

import LinkButton from "components/LinkButton";

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
}

function RevisionInfo({ number, link }: RevisionInfoInterface) {
  return (
    <>
      <div className={titleTextStyles}>Ревизия</div>
      <div className={infoColumnsWrapperStyles}>
        <div className={leftInfoColumnStyles}>
          <div className={lightTextStyles}>Номер:</div>
          <div className={lightTextStyles}>Ссылка:</div>
        </div>
        <div className={rightInfoColumnStyles}>
          <div className={textStyles}>{number}</div>
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
