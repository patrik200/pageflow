import React from "react";
import { observer } from "mobx-react-lite";
import { Image } from "@app/front-kit";

import { imageStyles, wrapperStyles } from "./style.css";

function Sample() {
  return (
    <div className={wrapperStyles}>
      <Image className={imageStyles} src="/images/blocks/sample/index.jpg" />
    </div>
  );
}

export default observer(Sample);
