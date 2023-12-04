import { ControllerResponse } from "@app/back-kit";
import { UserRole } from "@app/shared-enums";
import { Controller, Delete, Get, Param, Post } from "@nestjs/common";

import { withUserAuthorized } from "modules/auth";

import { AddCorrespondenceRevisionFavouritesService } from "../services/favourites/add";
import { GetCorrespondenceRevisionFavouritesListService } from "../services/favourites/get-list";
import { RemoveCorrespondenceRevisionFavouritesService } from "../services/favourites/remove";

import { ResponseCorrespondenceRevisionsListDTO } from "../dto/get/CorrespondenceRevision";

@Controller("correspondence-revisions/favourites")
export class CorrespondenceRevisionFavouritesController {
  constructor(
    private getRevisionFavouritesListService: GetCorrespondenceRevisionFavouritesListService,
    private addRevisionFavouritesService: AddCorrespondenceRevisionFavouritesService,
    private removeRevisionFavouritesService: RemoveCorrespondenceRevisionFavouritesService,
  ) {}

  @Get()
  @withUserAuthorized([UserRole.USER])
  async getFavourites() {
    const revisions = await this.getRevisionFavouritesListService.getFavouritesOrFail({
      loadAuthor: true,
      loadAuthorAvatar: true,
    });

    return new ControllerResponse(ResponseCorrespondenceRevisionsListDTO, { list: revisions });
  }

  @Post(":revisionId")
  @withUserAuthorized([UserRole.USER])
  async addFavourite(@Param("revisionId") revisionId: string) {
    await this.addRevisionFavouritesService.addFavouriteOrFail(revisionId);
  }

  @Delete(":revisionId")
  @withUserAuthorized([UserRole.USER])
  async deleteFavourite(@Param("revisionId") revisionId: string) {
    await this.removeRevisionFavouritesService.removeFavouriteOrFail(revisionId);
  }
}
