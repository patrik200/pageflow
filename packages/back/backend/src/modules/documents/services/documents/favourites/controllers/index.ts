import { ControllerResponse } from "@app/back-kit";
import { UserRole } from "@app/shared-enums";
import { Controller, Delete, Get, Param, Post } from "@nestjs/common";

import { withUserAuthorized } from "modules/auth";

import { GetDocumentFavouritesListService } from "../get-list";
import { AddDocumentFavouritesService } from "../add";
import { RemoveDocumentFavouritesService } from "../remove";
import { ResponseDocumentsListDTO } from "../../../../dto/get/Document";

@Controller("documents/favourites/document")
export class DocumentFavouritesController {
  constructor(
    private getDocumentFavouritesListService: GetDocumentFavouritesListService,
    private addDocumentFavouritesService: AddDocumentFavouritesService,
    private removeDocumentFavouritesService: RemoveDocumentFavouritesService,
  ) {}

  @Get()
  @withUserAuthorized([UserRole.USER])
  async getDocumentFavourites() {
    const documents = await this.getDocumentFavouritesListService.getDocumentFavouritesOrFail({
      loadDocumentAuthor: true,
      loadDocumentAuthorAvatar: true,
    });

    return new ControllerResponse(ResponseDocumentsListDTO, { list: documents });
  }

  @Post(":documentId")
  @withUserAuthorized([UserRole.USER])
  async addDocumentFavourite(@Param("documentId") documentId: string) {
    await this.addDocumentFavouritesService.addDocumentFavouriteOrFail(documentId);
  }

  @Delete(":documentId")
  @withUserAuthorized([UserRole.USER])
  async deleteDocumentFavourite(@Param("documentId") documentId: string) {
    await this.removeDocumentFavouritesService.removeDocumentFavouriteOrFail(documentId);
  }
}
