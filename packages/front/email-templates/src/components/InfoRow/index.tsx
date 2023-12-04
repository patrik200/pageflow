import React from "react";

import { textStyles } from "templates/coreStyles.css";
import { ReactComponent as InfoIcon } from "icons/info.svg";

import { infoIconStyles, infoRowWrapperStyles } from "./style.css";

interface InfoRowInterface {
  text: string;
}

function InfoRow({ text }: InfoRowInterface) {
  return (
    <div className={infoRowWrapperStyles}>
      <InfoIcon className={infoIconStyles} />
      <div className={textStyles}>{text}</div>
    </div>
  );
}

export default React.memo(InfoRow);
