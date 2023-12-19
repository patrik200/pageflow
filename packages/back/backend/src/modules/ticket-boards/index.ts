import { Global, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { NestModule } from "@app/back-kit";

import { TicketBoardEntity } from "entities/TicketBoard";
import { TicketBoardFavouriteEntity } from "entities/TicketBoard/Favourite";

import { TicketBoardsController } from "./controllers";
import { TicketBoardFavouritesController } from "./controllers/favourites";
import { TicketBoardPermissionsController } from "./controllers/permissions";

import { AddTicketBoardFavouritesService } from "./services/favourite/add";
import { GetTicketBoardIsFavouritesService } from "./services/favourite/get-is-favourite";
import { GetTicketBoardFavouritesListService } from "./services/favourite/get-list";
import { RemoveTicketBoardFavouritesService } from "./services/favourite/remove";
import { CreateTicketBoardService } from "./services/boards/create";
import { DeleteTicketBoardService } from "./services/boards/delete";
import { EditTicketBoardService } from "./services/boards/edit";
import { GetTicketBoardService } from "./services/boards/get";
import { GetTicketBoardsListService } from "./services/boards/get-list";
import { GetTicketBoardPermissionsService } from "./services/permissions/get";
import { CreateTicketBoardPermissionsService } from "./services/permissions/create";
import { DeleteTicketBoardPermissionsService } from "./services/permissions/delete";
import { EditTicketBoardPermissionsService } from "./services/permissions/edit";
import { IncrementNextTicketNumberService } from "./services/boards/increment-next-ticket-number";

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([TicketBoardEntity, TicketBoardFavouriteEntity])],
  controllers: [TicketBoardFavouritesController, TicketBoardsController, TicketBoardPermissionsController],
  providers: [
    AddTicketBoardFavouritesService,
    GetTicketBoardIsFavouritesService,
    GetTicketBoardFavouritesListService,
    RemoveTicketBoardFavouritesService,
    CreateTicketBoardService,
    DeleteTicketBoardService,
    EditTicketBoardService,
    GetTicketBoardService,
    GetTicketBoardsListService,
    GetTicketBoardPermissionsService,
    CreateTicketBoardPermissionsService,
    DeleteTicketBoardPermissionsService,
    EditTicketBoardPermissionsService,
    IncrementNextTicketNumberService,
  ],
  exports: [
    AddTicketBoardFavouritesService,
    GetTicketBoardIsFavouritesService,
    GetTicketBoardFavouritesListService,
    RemoveTicketBoardFavouritesService,
    CreateTicketBoardService,
    DeleteTicketBoardService,
    EditTicketBoardService,
    GetTicketBoardService,
    GetTicketBoardsListService,
    GetTicketBoardPermissionsService,
    CreateTicketBoardPermissionsService,
    DeleteTicketBoardPermissionsService,
    EditTicketBoardPermissionsService,
    IncrementNextTicketNumberService,
  ],
})
export class TicketBoardsModule implements NestModule {}

export * from "./services/favourite/add";
export * from "./services/favourite/get-is-favourite";
export * from "./services/favourite/get-list";
export * from "./services/favourite/remove";
export * from "./services/boards/create";
export * from "./services/boards/delete";
export * from "./services/boards/edit";
export * from "./services/boards/get";
export * from "./services/boards/get-list";
export * from "./services/boards/increment-next-ticket-number";
export * from "./services/permissions/create";
export * from "./services/permissions/delete";
export * from "./services/permissions/edit";
export * from "./services/permissions/get";
