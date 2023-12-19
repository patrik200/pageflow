import React from "react";

import Info from "./Info";
import Banner from "./Banner";
import RequestForm from "./RequestForm";

import { footerWrapperStyles } from "./style.css";

function Footer() {
  return (
    <div className={footerWrapperStyles}>
      <Banner />
      <RequestForm />
      <Info />
    </div>
  );
}

export default React.memo(Footer);
