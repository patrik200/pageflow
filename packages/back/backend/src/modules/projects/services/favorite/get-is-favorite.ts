import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { ProjectFavouriteEntity } from "entities/Project/Favourite";
import { ProjectEntity } from "entities/Project";

import { getCurrentUser } from "modules/auth";

@Injectable()
export class GetProjectIsFavouritesService {
  constructor(
    @InjectRepository(ProjectFavouriteEntity)
    private favouriteRepository: Repository<ProjectFavouriteEntity>,
  ) {}

  async getProjectIsFavourite(projectId: string) {
    const favourite = await this.favouriteRepository.findOne({
      where: { project: { id: projectId }, user: { id: getCurrentUser().userId } },
    });

    return !!favourite;
  }

  async loadProjectIsFavourite(project: ProjectEntity) {
    project.favourite = await this.getProjectIsFavourite(project.id);
    return project;
  }
}
