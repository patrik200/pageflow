import React from "react";
import Head from "next/head";
import { observer } from "mobx-react-lite";

import CardLoadingPreset from "components/Card/pressets/CardLoading";

import PageWrapperMenu from "./Menu";
import ClientNotifications from "./Notifications";

import { childrenWrapperStyles, pageWrapperStyles } from "./style.css";

interface PageWrapperInterface {
  title: string;
  loading?: boolean;
  children: React.ReactNode;
}

function PageWrapper({ title, loading, children }: PageWrapperInterface) {
  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <div className={pageWrapperStyles}>
        <PageWrapperMenu />
        <div className={childrenWrapperStyles}>
          <ClientNotifications />
          {loading ? <CardLoadingPreset title={title} /> : children}
        </div>
      </div>
    </>
  );
}

export default observer(PageWrapper);
