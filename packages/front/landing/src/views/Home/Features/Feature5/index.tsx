import React from "react";
import { observer } from "mobx-react-lite";

import { FeatureInterface } from "../types";

import FeatureTemplate from "../../FeatureTemplate";

import { wrapperStyles } from "./style.css";

function Feature5({ number, imagePosition }: FeatureInterface) {
  return (
    <FeatureTemplate
      className={wrapperStyles}
      imageSize="extra"
      imagePosition={imagePosition}
      number={number}
      title="Система управления задачами"
      description={`\
PageFlow предоставляет систему управления задачами в виде канбан-доски со списком задач.
Вы сможете наглядно отслеживать прогресс по задачам и управлять их приоритетами.
Это поможет вам организовать работу и достичь большей продуктивности.\
`}
      image="/images/blocks/feature5/index.jpg"
    />
  );
}

export default observer(Feature5);
