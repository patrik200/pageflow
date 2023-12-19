import { Global, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { TicketEntity } from "entities/Ticket";
import { ProjectEntity } from "entities/Project";
import { DocumentRevisionEntity } from "entities/Document/Document/Revision";

import { StatisticsController } from "./controller";

import { GetStatisticsService } from "./services/get";

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([TicketEntity, ProjectEntity, DocumentRevisionEntity])],
  controllers: [StatisticsController],
  providers: [GetStatisticsService],
  exports: [GetStatisticsService],
})
export class StatisticsModule {}

export * from "./dto/ChangeFeedEvent";

export * from "./services/get";
