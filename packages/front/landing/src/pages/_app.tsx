import "../init";

import React from "react";
import { AppProps } from "next/app";

import RootWrapper from "views/_RootWrapper";
import RootObservers from "views/_RootWrapper/Observers";

import "reseter.css/css/reseter.min.css";

import "styles";

export default function CustomApp({ Component, pageProps, router }: AppProps) {
  const isPayments = router.pathname === "/payments";
  const isInternalPage = router.pathname === "/404" || router.pathname === "/500" || isPayments;
  return (
    <main id="root">
      <Component
        {...pageProps}
        Wrapper={isInternalPage ? null : RootWrapper}
        additionalElement={isPayments ? undefined : <RootObservers />}
      />
    </main>
  );
}
