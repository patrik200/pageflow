import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { ClientEntity } from "entities/Client";

import { AppCommandWebSocketGateway } from "./gateway/app-comands.gateway";
import { AddFixtureToClientCommand } from "./service/add-fixture-to-client";
import { CreateAdminCommand } from "./service/create-admin";
import { CreateClientCommand } from "./service/create-client";
import { CreateUserCommand } from "./service/create-user";
import { ReadOnlyModeCommand } from "./service/read-only-mode";

@Module({
  imports: [TypeOrmModule.forFeature([ClientEntity])],
  providers: [
    AppCommandWebSocketGateway,
    AddFixtureToClientCommand,
    CreateAdminCommand,
    CreateUserCommand,
    CreateClientCommand,
    ReadOnlyModeCommand,
  ],
})
export class AppCommandsModule {}
