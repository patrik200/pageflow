import { Global, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { ClientEntity } from "entities/Client";
import { SubscriptionEntity } from "entities/Subscription";

import { ClientsController } from "./controllers";

import { DeleteClientService } from "./services/client/delete";
import { DeleteClientLogoService } from "./services/logo/delete";
import { EditClientService } from "./services/client/edit";
import { EditClientLogoService } from "./services/logo/edit";
import { GetClientService } from "./services/client/get";
import { CreateClientService } from "./services/client/create";
import { GetClientNotificationsService } from "./services/client/notifications";
import { UnusedClientsBackgroundDeleterService } from "./services/client/background/UnusedClientsBackgroundDeleter";

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([ClientEntity, SubscriptionEntity])],
  controllers: [ClientsController],
  providers: [
    CreateClientService,
    DeleteClientService,
    EditClientService,
    GetClientService,
    DeleteClientLogoService,
    EditClientLogoService,
    GetClientNotificationsService,
    UnusedClientsBackgroundDeleterService,
  ],
  exports: [
    CreateClientService,
    DeleteClientService,
    EditClientService,
    GetClientService,
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
