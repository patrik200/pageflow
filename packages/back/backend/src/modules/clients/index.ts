import { Global, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { ClientEntity } from "entities/Client";

import { ClientsController } from "./controllers";

import { DeleteClientService } from "./services/client/delete";
import { DeleteClientLogoService } from "./services/logo/delete";
import { EditClientService } from "./services/client/edit";
import { EditClientLogoService } from "./services/logo/edit";
import { GetClientsService } from "./services/client/get";
import { CreateClientService } from "./services/client/create";
import { GetClientNotificationsService } from "./services/client/notifications";

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([ClientEntity])],
  controllers: [ClientsController],
  providers: [
    CreateClientService,
    DeleteClientService,
    EditClientService,
    GetClientsService,
    DeleteClientLogoService,
    EditClientLogoService,
    GetClientNotificationsService,
  ],
  exports: [
    CreateClientService,
    DeleteClientService,
    EditClientService,
    GetClientsService,
    DeleteClientLogoService,
    EditClientLogoService,
  ],
})
export class ClientsModule {}

export * from "./services/logo/delete";
export * from "./services/logo/edit";
export * from "./services/client/create";
export * from "./services/client/delete";
export * from "./services/client/edit";
export * from "./services/client/get";
