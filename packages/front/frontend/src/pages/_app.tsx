// eslint-disable-next-line import/order
import _init from "../init";

import "@app/ui-kit/dist/style.css";

import React from "react";
import { AppProps } from "next/app";

import RootWrapper from "views/_RootWrapper";
import RootObservers from "views/_RootWrapper/Observers";

// eslint-disable-next-line import/newline-after-import
require("styles/root.css");

// HACK for force import
// @ts-ignore
global._init = _init;

export default function CustomApp({ Component, pageProps, router }: AppProps) {
  const isInternalPage = router.pathname === "/404" || router.pathname === "/500";
  return (
    <main id="root">
      <Component {...pageProps} Wrapper={isInternalPage ? null : RootWrapper} additionalElement={<RootObservers />} />
    </main>
  );
}
