import { ControllerResponse } from "@app/back-kit";
import { UserRole } from "@app/shared-enums";
import { Controller, Delete, Get, Param, Post } from "@nestjs/common";

import { withUserAuthorized } from "modules/auth";

import { GetCorrespondenceGroupFavouritesListService } from "../get-list";
import { AddCorrespondenceGroupFavouritesService } from "../add";
import { RemoveCorrespondenceGroupFavouritesService } from "../remove";
import { ResponseCorrespondenceGroupsListDTO } from "../../../../dto/get/CorrespondenceGroup";

@Controller("correspondences/favourites/correspondence-group")
export class CorrespondenceGroupFavouritesController {
  constructor(
    private getGroupFavouritesListService: GetCorrespondenceGroupFavouritesListService,
    private addGroupFavouritesService: AddCorrespondenceGroupFavouritesService,
    private removeGroupFavouritesService: RemoveCorrespondenceGroupFavouritesService,
  ) {}

  @Get()
  @withUserAuthorized([UserRole.USER])
  async getGroupFavourites() {
    const groups = await this.getGroupFavouritesListService.getGroupFavouritesOrFail({
      loadAuthor: true,
      loadAuthorAvatar: true,
    });

    return new ControllerResponse(ResponseCorrespondenceGroupsListDTO, { list: groups });
  }

  @Post(":groupId")
  @withUserAuthorized([UserRole.USER])
  async addGroupFavourite(@Param("groupId") groupId: string) {
    await this.addGroupFavouritesService.addGroupFavouriteOrFail(groupId);
  }

  @Delete(":groupId")
  @withUserAuthorized([UserRole.USER])
  async deleteGroupFavourite(@Param("groupId") groupId: string) {
    await this.removeGroupFavouritesService.removeGroupFavouriteOrFail(groupId, { forAllUsers: false });
  }
}
