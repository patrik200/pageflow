import React from "react";

import FirstBlock from "./FirstBlock";
import SecondBlock from "./SecondBlock";
import ThirdBlock from "./ThirdBlock";
import FourthBlock from "./FourthBlock";
import FifthBlock from "./FifthBlock";

import { termsContentWrapperStyles } from "./style.css";

function TermsContent() {
  return (
    <div className={termsContentWrapperStyles}>
      <FirstBlock />
      <SecondBlock />
      <ThirdBlock />
      <FourthBlock />
      <FifthBlock />
    </div>
  );
}

export default React.memo(TermsContent);
