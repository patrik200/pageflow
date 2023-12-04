import React from "react";
import { useTranslation } from "@app/front-kit";

import Header from "components/Header";

import PageWrapper from "../_PageWrapper";
import MainBanner from "./MainBanner";
import Content from "./Content";

function PrivacyView() {
  const { t } = useTranslation("privacy");

  return null;
  // TODO: implement
  return (
    <PageWrapper title={t({ scope: "meta", name: "title" })} description={t({ scope: "meta", name: "description" })}>
      <Header />
      <MainBanner />
      <Content />
    </PageWrapper>
  );
}

export default React.memo(PrivacyView);
