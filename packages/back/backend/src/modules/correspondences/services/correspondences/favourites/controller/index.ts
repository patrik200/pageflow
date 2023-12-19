import { ControllerResponse } from "@app/back-kit";
import { UserRole } from "@app/shared-enums";
import { Controller, Delete, Get, Param, Post } from "@nestjs/common";

import { withUserAuthorized } from "modules/auth";

import { GetCorrespondenceFavouritesListService } from "../get-list";
import { AddCorrespondenceFavouritesService } from "../add";
import { RemoveCorrespondenceFavouritesService } from "../remove";
import { ResponseCorrespondencesListDTO } from "../../../../dto/get/Correspondence";

@Controller("correspondences/favourites/correspondence")
export class CorrespondenceFavouritesController {
  constructor(
    private getFavouritesListService: GetCorrespondenceFavouritesListService,
    private addFavouritesService: AddCorrespondenceFavouritesService,
    private removeFavouritesService: RemoveCorrespondenceFavouritesService,
  ) {}

  @Get()
  @withUserAuthorized([UserRole.USER])
  async getCorrespondenceFavourites() {
    const correspondences = await this.getFavouritesListService.getCorrespondenceFavouritesOrFail({
      loadAuthor: true,
      loadAuthorAvatar: true,
    });

    return new ControllerResponse(ResponseCorrespondencesListDTO, { list: correspondences });
  }

  @Post(":correspondenceId")
  @withUserAuthorized([UserRole.USER])
  async addCorrespondenceFavourite(@Param("correspondenceId") correspondenceId: string) {
    await this.addFavouritesService.addCorrespondenceFavouriteOrFail(correspondenceId);
  }

  @Delete(":correspondenceId")
  @withUserAuthorized([UserRole.USER])
  async deleteCorrespondenceFavourite(@Param("correspondenceId") correspondenceId: string) {
    await this.removeFavouritesService.removeCorrespondenceFavouriteOrFail(correspondenceId, { forAllUsers: false });
  }
}
