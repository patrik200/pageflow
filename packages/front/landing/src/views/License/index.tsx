import React from "react";
import { useTranslation } from "@app/front-kit";
import Head from "next/head";

import Content from "./Content";

function LicenseView() {
  const { t } = useTranslation("license");

  return (
    <>
      <Head>
        <title>{t({ scope: "meta", name: "title" })}</title>
        <meta name="description" content={t({ scope: "meta", name: "description" })} />
      </Head>
      <Content />
    </>
  );
}

export default React.memo(LicenseView);
