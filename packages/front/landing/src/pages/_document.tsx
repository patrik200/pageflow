import React from "react";
import Document, { Head, Html, Main, NextScript } from "next/document";
import { nextFaviconGenerator } from "@app/front-kit";
import fs from "node:fs/promises";
import path from "node:path";

import { rootNamespaceClassName as rootCN } from "styles";

nextFaviconGenerator.generate(process.cwd(), (pathArray) => fs.readdir(path.join(...pathArray)));

const htmlClassName = `${rootCN} ${rootCN}-app ${rootCN}-app-reset`;

export default class MyDocument extends Document {
  render() {
    return (
      <Html lang={this.props.locale} className={htmlClassName}>
        <Head>
          {process.env.NODE_ENV === "development" ? (
            <link rel="icon" href="/icons/logo.svg" />
          ) : (
            nextFaviconGenerator.element
          )}
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
