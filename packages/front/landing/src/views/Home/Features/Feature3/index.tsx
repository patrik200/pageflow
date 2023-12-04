import React from "react";
import { observer } from "mobx-react-lite";

import { FeatureInterface } from "../types";

import FeatureTemplate from "../../FeatureTemplate";

import { wrapperStyles } from "./style.css";

function Feature3({ number, imagePosition }: FeatureInterface) {
  return (
    <FeatureTemplate
      className={wrapperStyles}
      imageSize="large"
      imagePosition={imagePosition}
      number={number}
      title="Система оповещений о действиях"
      description={`\
PageFlow обладает мощной системой нотификаций, которая информирует пользователей о любых действиях в системе.
Вы будете получать оповещения о новых версиях документов, комментариях, \
действиях по документам и других важных событиях.\
`}
      image="/images/blocks/feature3/index.jpg"
    />
  );
}

export default observer(Feature3);
