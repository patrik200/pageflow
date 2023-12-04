import React from "react";
import { rootNamespaceClassName as rootCN } from "@app/ui-kit";
import Document, { Head, Html, Main, NextScript } from "next/document";

const htmlClassName = `${rootCN} ${rootCN}-app ${rootCN}-app-reset`;

export default class MyDocument extends Document {
  render() {
    return (
      <Html lang={this.props.locale} className={htmlClassName}>
        <Head>
          <link rel="icon" href="/icons/logo.svg" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
