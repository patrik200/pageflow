import React from "react";
import dynamic from "next/dynamic";

const NotificationsContainer = dynamic(() => import("./NotificationsContainer"), { ssr: false });
const SupportChat = dynamic(() => import("./SupportChat"), { ssr: false });

function RootObservers() {
  return (
    <>
      <NotificationsContainer />
      <SupportChat />
    </>
  );
}

export default React.memo(RootObservers);
