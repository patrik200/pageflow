import React from "react";
import { observer } from "mobx-react-lite";

import { FeatureInterface } from "../types";

import FeatureTemplate from "../../FeatureTemplate";

import { wrapperStyles } from "./style.css";

function Feature1({ number, imagePosition }: FeatureInterface) {
  return (
    <FeatureTemplate
      className={wrapperStyles}
      imageSize="medium"
      imagePosition={imagePosition}
      number={number}
      title="Процесс поэтапного согласования"
      description={`\
Для принятия новой версии документов необходимо пройти установленные шаги согласования.
Каждый этап согласования представляет собой важный шаг в процессе утверждения документа.
Этапы согласования могут быть настроены в соответствии с требованиями вашей компании.\
`}
      image="/images/blocks/feature1/index.jpg"
    />
  );
}

export default observer(Feature1);
