import React from "react";
import { observer } from "mobx-react-lite";
import Head from "next/head";

import PageWrapper from "../_PageWrapper";
import MainBanner from "./MainBanner";
import FeaturesTitle from "./FeaturesTitle";
import TariffPlan from "./TariffPlan";
import Features from "./Features";
import Footer from "./Footer";

function HomeView() {
  return (
    <>
      <Head>
        <meta name="og:image" content="/images/og_image/social.jpg" />
        <meta name="og:locale" content="ru_RU" />
        <meta name="og:type" content="website" />
        <meta name="og:title" content="Система управления документами" />
        <meta
          name="og:description"
          content="Утверждения документов. Автоматизация бизнес-процессов. Электронный документооборот."
        />
      </Head>
      <PageWrapper
        title="PageFlow | Система управления документами"
        description="тверждения документов. Автоматизация бизнес-процессов. Электронный документооборот."
      >
        <MainBanner />
        <FeaturesTitle />
        <Features />
        <TariffPlan />
        <Footer />
      </PageWrapper>
    </>
  );
}

export default observer(HomeView);
