import React from "react";
import Head from "next/head";
import { observer } from "mobx-react-lite";

import { globalThemeColorVars } from "styles";

interface RootWrapperInterface {
  children: React.ReactNode;
}

function RootWrapper({ children }: RootWrapperInterface) {
  return (
    <>
      <Head>
        <meta
          key={0}
          name="viewport"
          content="viewport-fit=cover, initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=0"
        />
        <meta key={1} name="theme-color" content={globalThemeColorVars.primary} />
      </Head>
      {children}
    </>
  );
}

export default observer(RootWrapper);
