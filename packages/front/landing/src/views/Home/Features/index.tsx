import React from "react";
import { observer } from "mobx-react-lite";

import Feature1 from "./Feature1";
import Feature2 from "./Feature2";
import Feature3 from "./Feature3";
import Feature4 from "./Feature4";
import Feature5 from "./Feature5";

function Features() {
  return (
    <>
      {features.map((Feature, index) => (
        <Feature key={index} number={index + 1} imagePosition={index % 2 === 0 ? "right" : "left"} />
      ))}
    </>
  );
}

export default observer(Features);

const features = [Feature1, Feature2, Feature3, Feature4, Feature5];
