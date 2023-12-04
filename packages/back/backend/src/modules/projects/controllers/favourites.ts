import { ControllerResponse } from "@app/back-kit";
import { UserRole } from "@app/shared-enums";
import { Controller, Delete, Get, Param, Post } from "@nestjs/common";

import { withUserAuthorized } from "modules/auth";

import { AddProjectFavouritesService } from "../services/favorite/add";
import { GetProjectFavouritesListService } from "../services/favorite/get-list";
import { RemoveProjectFavouritesService } from "../services/favorite/remove";

import { ResponseProjectsListDTO } from "../dto/get/Project";

@Controller("projects/favourites")
export class ProjectFavouritesController {
  constructor(
    private getProjectFavouritesListService: GetProjectFavouritesListService,
    private addProjectFavouritesService: AddProjectFavouritesService,
    private removeProjectFavouritesService: RemoveProjectFavouritesService,
  ) {}

  @Get()
  @withUserAuthorized([UserRole.USER])
  async getFavourites() {
    const projects = await this.getProjectFavouritesListService.getFavouritesOrFail({
      loadAuthor: true,
      loadAuthorAvatar: true,
    });

    return new ControllerResponse(ResponseProjectsListDTO, { list: projects });
  }

  @Post(":projectId")
  @withUserAuthorized([UserRole.USER])
  async addFavourite(@Param("projectId") projectId: string) {
    await this.addProjectFavouritesService.addFavouriteOrFail(projectId);
  }

  @Delete(":projectId")
  @withUserAuthorized([UserRole.USER])
  async deleteFavourite(@Param("projectId") projectId: string) {
    await this.removeProjectFavouritesService.removeFavouriteOrFail(projectId);
  }
}
