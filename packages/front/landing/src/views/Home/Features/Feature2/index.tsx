import React from "react";
import { observer } from "mobx-react-lite";

import { FeatureInterface } from "../types";

import FeatureTemplate from "../../FeatureTemplate";

import { wrapperStyles } from "./style.css";

function Feature2({ number, imagePosition }: FeatureInterface) {
  return (
    <FeatureTemplate
      className={wrapperStyles}
      imageSize="large"
      imagePosition={imagePosition}
      number={number}
      title="Обсуждение документов"
      description={`\
При принятии новой версии документа пользователи могут оставлять комментарии.
Новая версия документа не будет принята, пока все комментарии не будут решены.
Это обеспечивает прозрачность и эффективность обсуждений.\
`}
      image="/images/blocks/feature2/index.jpg"
    />
  );
}

export default observer(Feature2);
