import React from "react";

import FirstBlock from "./FirstBlock";
import SecondBlock from "./SecondBlock";
import ThirdBlock from "./ThirdBlock";
import FourthBlock from "./FourthBlock";
import FifthBlock from "./FifthBlock";
import SixthBlock from "./SixthBlock";

import { privacyContentWrapperStyles } from "./style.css";

function PrivacyContent() {
  return (
    <div className={privacyContentWrapperStyles}>
      <FirstBlock />
      <SecondBlock />
      <ThirdBlock />
      <FourthBlock />
      <FifthBlock />
      <SixthBlock />
    </div>
  );
}

export default React.memo(PrivacyContent);
