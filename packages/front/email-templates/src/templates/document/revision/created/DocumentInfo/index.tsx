import React from "react";

import {
  infoColumnsWrapperStyles,
  leftInfoColumnStyles,
  lightTextStyles,
  rightInfoColumnStyles,
  textStyles,
  titleTextStyles,
} from "templates/coreStyles.css";

interface DocumentViewInterface {
  name: string;
}

function DocumentView({ name }: DocumentViewInterface) {
  return (
    <>
      <div className={titleTextStyles}>В документе</div>
      <div className={infoColumnsWrapperStyles}>
        <div className={leftInfoColumnStyles}>
          <div className={lightTextStyles}>Название:</div>
        </div>
        <div className={rightInfoColumnStyles}>
          <div className={textStyles}>{name}</div>
        </div>
      </div>
    </>
  );
}

export default React.memo(DocumentView);
