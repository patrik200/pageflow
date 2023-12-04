import { HttpAdapterHost } from "@nestjs/core";
import { Injectable } from "@nestjs/common";
import { asyncTimeout } from "@worksolutions/utils";
import { Server } from "node:http";
import { Application } from "express";

@Injectable()
export class NestService {
  constructor(private httpAdapterHost: HttpAdapterHost) {}

  async getApplication(period = 100): Promise<Application> {
    const server = await this.httpAdapterHost.httpAdapter.getInstance();
    if (server) return server;
    await asyncTimeout(period);
    return await this.getApplication(period);
  }

  async getHttpServer(period = 200): Promise<Server> {
    const server = await this.httpAdapterHost.httpAdapter.getHttpServer();
    if (server) return server;
    await asyncTimeout(period);
    return await this.getHttpServer(period);
  }
}
