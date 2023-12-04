import React from "react";
import Script from "next/script";

import "./style.css";

function SupportChat() {
  if (process.env.NODE_ENV === "development") return null;
  return (
    <Script src={`https://script.click-chat.ru/chat.js?wid=${process.env.SUPPORT_TOKEN}`} async strategy="lazyOnload" />
  );
}

export default React.memo(SupportChat);
