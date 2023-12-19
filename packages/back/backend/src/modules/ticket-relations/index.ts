import { Global, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { TicketRelationEntity } from "entities/Ticket/TicketRelation";

import { TicketRelationsController } from "./controllers";

import { GetTicketRelationsService } from "./services/get";
import { EditTicketRelationsService } from "./services/edit-list";

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([TicketRelationEntity])],
  controllers: [TicketRelationsController],
  providers: [GetTicketRelationsService, EditTicketRelationsService],
  exports: [GetTicketRelationsService, EditTicketRelationsService],
})
export class TicketRelationsModule {}

export * from "./services/get";
export * from "./services/edit-list";
