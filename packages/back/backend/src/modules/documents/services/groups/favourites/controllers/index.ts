import { ControllerResponse } from "@app/back-kit";
import { UserRole } from "@app/shared-enums";
import { Controller, Delete, Get, Param, Post } from "@nestjs/common";

import { withUserAuthorized } from "modules/auth";

import { AddDocumentGroupFavouritesService } from "../add";
import { GetDocumentGroupFavouritesListService } from "../get-list";
import { RemoveDocumentGroupFavouritesService } from "../remove";
import { ResponseDocumentGroupsListDTO } from "../../../../dto/get/DocumentGroup";

@Controller("documents/favourites/document-group")
export class DocumentGroupFavouritesController {
  constructor(
    private getDocumentGroupFavouritesListService: GetDocumentGroupFavouritesListService,
    private addDocumentGroupFavouritesService: AddDocumentGroupFavouritesService,
    private removeDocumentGroupFavouritesService: RemoveDocumentGroupFavouritesService,
  ) {}

  @Get()
  @withUserAuthorized([UserRole.USER])
  async getGroupFavourites() {
    const groups = await this.getDocumentGroupFavouritesListService.getGroupFavouritesOrFail({
      loadAuthor: true,
      loadAuthorAvatar: true,
      loadRootGroup: true,
      loadRootGroupParentProject: true,
    });

    return new ControllerResponse(ResponseDocumentGroupsListDTO, { list: groups });
  }

  @Post(":groupId")
  @withUserAuthorized([UserRole.USER])
  async addGroupFavourite(@Param("groupId") groupId: string) {
    await this.addDocumentGroupFavouritesService.addGroupFavouriteOrFail(groupId);
  }

  @Delete(":groupId")
  @withUserAuthorized([UserRole.USER])
  async deleteGroupFavourite(@Param("groupId") groupId: string) {
    await this.removeDocumentGroupFavouritesService.removeGroupFavouriteOrFail(groupId, { forAllUsers: false });
  }
}
