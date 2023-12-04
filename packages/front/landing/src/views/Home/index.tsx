import React from "react";
import { observer } from "mobx-react-lite";
import { useTranslation } from "@app/front-kit";

import Header from "components/Header";

import PageWrapper from "../_PageWrapper";
import MainBanner from "./MainBanner";
import Sample from "./Sample";
import FeaturesTitle from "./FeaturesTitle";
import Features from "./Features";
import FooterBanner from "./FooterBanner";
import RequestForm from "./RequestForm";
import Footer from "./Footer";

function HomeView() {
  const { t } = useTranslation("home");

  return (
    <PageWrapper title={t({ scope: "meta", name: "title" })} description={t({ scope: "meta", name: "description" })}>
      <Header />
      <MainBanner />
      <Sample />
      <FeaturesTitle />
      <Features />
      <FooterBanner />
      <RequestForm />
      <Footer />
    </PageWrapper>
  );
}

export default observer(HomeView);
