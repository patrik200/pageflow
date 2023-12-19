import { ControllerResponse } from "@app/back-kit";
import { UserRole } from "@app/shared-enums";
import { Controller, Delete, Get, Param, Post } from "@nestjs/common";

import { withUserAuthorized } from "modules/auth";

import { AddTicketBoardFavouritesService } from "../services/favourite/add";
import { GetTicketBoardFavouritesListService } from "../services/favourite/get-list";
import { RemoveTicketBoardFavouritesService } from "../services/favourite/remove";

import { ResponseTicketBoardsListDTO } from "../dto/get/TicketBoard";

@Controller("ticket-boards/favourites")
export class TicketBoardFavouritesController {
  constructor(
    private getFavouritesListService: GetTicketBoardFavouritesListService,
    private addFavouritesService: AddTicketBoardFavouritesService,
    private removeFavouritesService: RemoveTicketBoardFavouritesService,
  ) {}

  @Get()
  @withUserAuthorized([UserRole.USER])
  async getFavourites() {
    const boards = await this.getFavouritesListService.getFavouritesOrFail();

    return new ControllerResponse(ResponseTicketBoardsListDTO, { list: boards });
  }

  @Post(":boardId")
  @withUserAuthorized([UserRole.USER])
  async addFavourite(@Param("boardId") boardId: string) {
    await this.addFavouritesService.addFavouriteOrFail(boardId);
  }

  @Delete(":boardId")
  @withUserAuthorized([UserRole.USER])
  async deleteFavourite(@Param("boardId") boardId: string) {
    await this.removeFavouritesService.removeFavouriteOrFail(boardId, { forAllUsers: false });
  }
}
