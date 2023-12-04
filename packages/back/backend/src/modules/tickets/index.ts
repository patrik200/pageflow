import { Global, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { NestModule } from "@app/back-kit";

import { TicketEntity } from "entities/Ticket";
import { TicketCommentEntity } from "entities/Ticket/Comment";
import { TicketCommentFileEntity } from "entities/Ticket/Comment/File";
import { TicketFileEntity } from "entities/Ticket/File";
import { TicketFavouriteEntity } from "entities/Ticket/Favourite";

import { TicketsController } from "./controllers";
import { TicketFavouritesController } from "./controllers/favourites";

import { AddTicketFavouritesService } from "./services/favourite/add";
import { GetTicketIsFavouritesService } from "./services/favourite/get-is-favourite";
import { GetTicketFavouritesListService } from "./services/favourite/get-list";
import { RemoveTicketFavouritesService } from "./services/favourite/remove";
import { DeleteTicketFilesService } from "./services/file/delete";
import { UploadTicketFilesService } from "./services/file/upload";
import { TicketAutoArchiverService } from "./services/background/auto-archiver";
import { CreateTicketService } from "./services/tickets/create";
import { DeleteTicketService } from "./services/tickets/delete";
import { EditTicketsService } from "./services/tickets/edit";
import { GetTicketService } from "./services/tickets/get";
import { GetTicketsForEditService } from "./services/tickets/get-for-update";
import { GetTicketsListService } from "./services/tickets/get-list";
import { ReorderTicketsService } from "./services/tickets/reorder";
import { GetActiveTicketsCountService } from "./services/tickets/get-active-tickes-count";
import { TicketEventListenerService } from "./services/background/event-listener";
import { InitElasticTicketService } from "./services/init";
import { CreateTicketElasticService } from "./services/tickets/create-elastic";

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([
      TicketEntity,
      TicketCommentEntity,
      TicketCommentFileEntity,
      TicketFileEntity,
      TicketFavouriteEntity,
    ]),
  ],
  controllers: [TicketFavouritesController, TicketsController],
  providers: [
    InitElasticTicketService,
    AddTicketFavouritesService,
    GetTicketIsFavouritesService,
    GetTicketFavouritesListService,
    RemoveTicketFavouritesService,
    DeleteTicketFilesService,
    UploadTicketFilesService,
    CreateTicketElasticService,
    CreateTicketService,
    DeleteTicketService,
    EditTicketsService,
    GetTicketService,
    GetTicketsForEditService,
    GetTicketsListService,
    ReorderTicketsService,
    TicketAutoArchiverService,
    TicketEventListenerService,
    GetActiveTicketsCountService,
    InitElasticTicketService,
  ],
  exports: [
    InitElasticTicketService,
    AddTicketFavouritesService,
    GetTicketIsFavouritesService,
    GetTicketFavouritesListService,
    RemoveTicketFavouritesService,
    DeleteTicketFilesService,
    UploadTicketFilesService,
    CreateTicketElasticService,
    CreateTicketService,
    DeleteTicketService,
    EditTicketsService,
    GetTicketService,
    GetTicketsListService,
    ReorderTicketsService,
    GetActiveTicketsCountService,
    InitElasticTicketService,
  ],
})
export class TicketsModule implements NestModule {
  constructor(initElasticTicketService: InitElasticTicketService) {
    initElasticTicketService.appBootstrap();
  }
}

export * from "./services/favourite/add";
export * from "./services/favourite/get-is-favourite";
export * from "./services/favourite/get-list";
export * from "./services/favourite/remove";

export * from "./services/file/delete";
export * from "./services/file/upload";

export * from "./services/tickets/create";
export * from "./services/tickets/delete";
export * from "./services/tickets/get";
export * from "./services/tickets/get-active-tickes-count";
export * from "./services/tickets/get-list";
export * from "./services/tickets/reorder";
