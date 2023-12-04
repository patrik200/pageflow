import React from "react";
import { observer } from "mobx-react-lite";

import { FeatureInterface } from "../types";

import FeatureTemplate from "../../FeatureTemplate";

import { wrapperStyles } from "./style.css";

function Feature4({ number, imagePosition }: FeatureInterface) {
  return (
    <FeatureTemplate
      className={wrapperStyles}
      imageSize="extra"
      imagePosition={imagePosition}
      number={number}
      title="Система справочников"
      description={`\
В PageFlow вы можете устанавливать свои собственные значения справочников для документов и запросов.
Это позволяет вам создавать общие справочники для классификации документов и запросов по разным категориям.
Вы сможете использовать атрибуты для более удобного поиска и фильтрации.\
`}
      image="/images/blocks/feature4/index.jpg"
    />
  );
}

export default observer(Feature4);
