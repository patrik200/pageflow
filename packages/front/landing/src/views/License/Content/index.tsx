import React from "react";

import FirstBlock from "./FirstBlock";
import SecondBlock from "./SecondBlock";
import ThirdBlock from "./ThirdBlock";
import FourthBlock from "./FourthBlock";
import FifthBlock from "./FifthBlock";
import SixthBlock from "./SixthBlock";

import { contentWrapperStyles } from "./style.css";

function LicenseContent() {
  return (
    <div className={contentWrapperStyles}>
      <FirstBlock />
      <SecondBlock />
      <ThirdBlock />
      <FourthBlock />
      <FifthBlock />
      <SixthBlock />
    </div>
  );
}

export default React.memo(LicenseContent);
