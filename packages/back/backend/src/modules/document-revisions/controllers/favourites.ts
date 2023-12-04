import { ControllerResponse } from "@app/back-kit";
import { UserRole } from "@app/shared-enums";
import { Controller, Delete, Get, Param, Post } from "@nestjs/common";

import { withUserAuthorized } from "modules/auth";

import { AddDocumentRevisionFavouritesService } from "../services/favourites/add";
import { GetDocumentRevisionFavouritesListService } from "../services/favourites/get-list";
import { RemoveDocumentRevisionFavouritesService } from "../services/favourites/remove";

import { ResponseDocumentRevisionsListDTO } from "../dto/get/DocumentRevision";

@Controller("document-revisions/favourites")
export class DocumentRevisionFavouritesController {
  constructor(
    private getDocumentRevisionFavouritesListService: GetDocumentRevisionFavouritesListService,
    private addDocumentRevisionFavouritesService: AddDocumentRevisionFavouritesService,
    private removeDocumentRevisionFavouritesService: RemoveDocumentRevisionFavouritesService,
  ) {}

  @Get()
  @withUserAuthorized([UserRole.USER])
  async getFavourites() {
    const revisions = await this.getDocumentRevisionFavouritesListService.getFavouritesOrFail({
      loadAuthorAvatar: true,
    });

    return new ControllerResponse(ResponseDocumentRevisionsListDTO, { list: revisions });
  }

  @Post(":revisionId")
  @withUserAuthorized([UserRole.USER])
  async addFavourite(@Param("revisionId") revisionId: string) {
    await this.addDocumentRevisionFavouritesService.addFavouriteOrFail(revisionId);
  }

  @Delete(":revisionId")
  @withUserAuthorized([UserRole.USER])
  async deleteFavourite(@Param("revisionId") revisionId: string) {
    await this.removeDocumentRevisionFavouritesService.removeFavouriteOrFail(revisionId);
  }
}
