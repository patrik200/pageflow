import { ControllerResponse } from "@app/back-kit";
import { UserRole } from "@app/shared-enums";
import { Controller, Delete, Get, Param, Post } from "@nestjs/common";

import { withUserAuthorized } from "modules/auth";

import { AddTicketFavouritesService } from "../services/favourite/add";
import { GetTicketFavouritesListService } from "../services/favourite/get-list";
import { RemoveTicketFavouritesService } from "../services/favourite/remove";

import { ResponseTicketsListDTO } from "../dto/get/Ticket";

@Controller("tickets/favourites")
export class TicketFavouritesController {
  constructor(
    private getFavouritesListService: GetTicketFavouritesListService,
    private addFavouritesService: AddTicketFavouritesService,
    private removeFavouritesService: RemoveTicketFavouritesService,
  ) {}

  @Get()
  @withUserAuthorized([UserRole.USER])
  async getFavourites() {
    const tickets = await this.getFavouritesListService.getFavouritesOrFail({
      loadStatus: true,
    });

    return new ControllerResponse(ResponseTicketsListDTO, { list: tickets });
  }

  @Post(":ticketId")
  @withUserAuthorized([UserRole.USER])
  async addFavourite(@Param("ticketId") ticketId: string) {
    await this.addFavouritesService.addFavouriteOrFail(ticketId);
  }

  @Delete(":ticketId")
  @withUserAuthorized([UserRole.USER])
  async deleteFavourite(@Param("ticketId") ticketId: string) {
    await this.removeFavouritesService.removeFavouriteOrFail(ticketId, { forAllUsers: false });
  }
}
