import React from "react";
import { renderToString } from "react-dom/server";
import { Injectable } from "@nestjs/common";
import { load as cheerioLoad } from "cheerio";
import { cachedProperty } from "@app/kit";
import fs from "node:fs/promises";
import path from "node:path";

import { getClientDomainByEnv } from "utils/getClientDomainByEnv";

@Injectable()
export class EmailRendererService {
  @cachedProperty(-1)
  private async getComponents() {
    const css = await fs.readFile(path.join(require.resolve("@app/email-templates"), "..", "style.css"), "utf8");
    const components = require("@app/email-templates") as Record<string, React.FC<any>>;
    return { components, css };
  }

  async renderEmailComponent(name: string, clientDomain: string, props: Record<string, any>) {
    const { components, css } = await this.getComponents();
    const component = components[name];
    const html = renderToString(
      React.createElement(component, { ...props, frontendHost: getClientDomainByEnv(clientDomain) }),
    );
    const $ = cheerioLoad(html);
    const head = $("head");
    head.append(`<style>${css}</style>`);
    return "<!doctype html>" + $.html();
  }
}
