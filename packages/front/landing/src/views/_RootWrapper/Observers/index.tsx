import React from "react";
import dynamic from "next/dynamic";

const SupportChat = dynamic(() => import("./SupportChat"), { ssr: false });
const YandexMetrica = dynamic(() => import("./YandexMetrica"), { ssr: false });

function RootObservers() {
  return (
    <>
      <SupportChat />
      <YandexMetrica />
    </>
  );
}

export default React.memo(RootObservers);
