import React from "react";
import Document, { Head, Html, Main, NextScript } from "next/document";

import { rootNamespaceClassName as rootCN } from "styles";

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
