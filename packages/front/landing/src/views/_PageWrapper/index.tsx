import React from "react";
import Head from "next/head";
import { observer } from "mobx-react-lite";

import { pageWrapperStyles } from "./style.css";

interface PageWrapperInterface {
  title: string;
  description?: string;
  children: React.ReactNode;
}

function PageWrapper({ title, description, children }: PageWrapperInterface) {
  return (
    <>
      <Head>
        <title>{title}</title>
        {description && <meta name="description" content={description} />}
      </Head>
      <div className={pageWrapperStyles}>{children}</div>
    </>
  );
}

export default observer(PageWrapper);
