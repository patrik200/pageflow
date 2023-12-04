import { Constructable } from "typedi";
import { ExpressAdapter } from "@nestjs/platform-express";
import express from "express";
import { NestFactory } from "@nestjs/core";

import { setModuleResolver } from "libs";

export async function initializeNest(AppModule: Constructable<any>) {
  const expressAdapter = new ExpressAdapter(express());
  expressAdapter.setNotFoundHandler = null!;
  const app = await NestFactory.create(AppModule, expressAdapter);
  setModuleResolver(app.resolve);
  return { app };
}
