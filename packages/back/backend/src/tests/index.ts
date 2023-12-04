import { config } from "@app/core-config";
import axios from "axios";
import crypto from "node:crypto";
import FormData from "form-data";
import fs from "node:fs/promises";
import { cachedProperty } from "@app/kit";
import path from "node:path";

import { executeCommand } from "modules/app-commands/cli/execute-command";

export class TestUtils {
  getAxios() {
    return axios.create({ baseURL: "http://localhost:" + config.server + "/api" });
  }

  private clientIndex = 0;
  async createClient() {
    this.clientIndex++;
    const domain = `${this.clientIndex}-${crypto.randomBytes(4).toString("hex")}-localhost`;
    const name = this.clientIndex.toString();

    const [createClientMessage] = await executeCommand("create-client", { name, domain }, false);
    const idStartIndex = createClientMessage.indexOf(`ID = "`) + 6;
    const clientId = createClientMessage.slice(idStartIndex, createClientMessage.indexOf('"', idStartIndex));

    const adminEmail = "admin@pageflow.ru";
    const adminPassword = await this.createAdmin(clientId, adminEmail);

    const userEmail = "user@pageflow.ru";
    const userPassword = await this.createUser(clientId, userEmail);

    return { clientName: name, clientId, domain, adminEmail, adminPassword, userEmail, userPassword };
  }

  async createUser(clientId: string, email = "user@pageflow.ru") {
    const [userMessage] = await executeCommand("create-user", { clientId, email: email }, false);
    const passwordStartIndex = userMessage.indexOf(`Password = "`) + 12;
    return userMessage.slice(passwordStartIndex, userMessage.indexOf('"', passwordStartIndex));
  }

  async createAdmin(clientId: string, email = "admin@pageflow.ru") {
    const [user] = await executeCommand("create-admin", { clientId, email: email }, false);
    const passwordStartIndex = user.indexOf(`Password = "`) + 12;
    return user.slice(passwordStartIndex, user.indexOf('"', passwordStartIndex));
  }

  async authAdmin(clientId: string, email = "admin@pageflow.ru") {
    const axios = this.getAxios();
    const response = await axios.post("/auth/authorize-by-email", {
      clientId,
      email,
      password: "0",
    });

    const token = response.headers["set-cookie"]![0].split(";")[0].split("=")[1];

    axios.interceptors.request.use((config) => {
      Object.assign(config.headers!.common, { cookie: "token=" + token });
      return config;
    });

    return [axios, { adminId: response.data.id, clientId, email }] as const;
  }

  async authUser(clientId: string, email = "user@pageflow.ru") {
    const axios = this.getAxios();
    const response = await axios.post("/auth/authorize-by-email", {
      clientId,
      email,
      password: "0",
    });

    const token = response.headers["set-cookie"]![0].split(";")[0].split("=")[1];

    axios.interceptors.request.use((config) => {
      Object.assign(config.headers!.common, { cookie: "token=" + token });
      return config;
    });

    return [axios, { userId: response.data.id, clientId, email }] as const;
  }

  @cachedProperty(-1)
  private async getTestImage() {
    const fullPath = path.join(config.rootPath, "packages", "back", "backend", "src", "tests", "files", "image.jpg");
    return await fs.readFile(fullPath);
  }

  async getTestImageFormData() {
    const form = new FormData();
    form.append("file", await this.getTestImage(), "image.jpg");
    return form;
  }
}
