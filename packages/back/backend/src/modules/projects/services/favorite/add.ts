import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Transactional } from "typeorm-transactional";

import { ProjectEntity } from "entities/Project";
import { ProjectFavouriteEntity } from "entities/Project/Favourite";

import { getCurrentUser } from "modules/auth";

@Injectable()
export class AddProjectFavouritesService {
  constructor(
    @InjectRepository(ProjectEntity)
    private projectRepository: Repository<ProjectEntity>,
    @InjectRepository(ProjectFavouriteEntity)
    private favouriteRepository: Repository<ProjectFavouriteEntity>,
  ) {}

  @Transactional()
  async addFavouriteOrFail(projectId: string) {
    const { clientId, userId } = getCurrentUser();
    const project = await this.projectRepository.findOneOrFail({
      withDeleted: true,
      where: { id: projectId, client: { id: clientId } },
    });
    await this.favouriteRepository.save({ project: { id: project.id }, user: { id: userId } });
  }
}
