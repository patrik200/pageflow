import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOptionsWhere, Repository } from "typeorm";
import { Transactional } from "typeorm-transactional";

import { ProjectEntity } from "entities/Project";
import { ProjectFavouriteEntity } from "entities/Project/Favourite";

import { getCurrentUser } from "modules/auth";

@Injectable()
export class RemoveProjectFavouritesService {
  constructor(
    @InjectRepository(ProjectEntity)
    private projectRepository: Repository<ProjectEntity>,
    @InjectRepository(ProjectFavouriteEntity)
    private favouriteRepository: Repository<ProjectFavouriteEntity>,
  ) {}

  @Transactional()
  async removeFavouriteOrFail(projectId: string, { forAllUsers }: { forAllUsers: boolean }) {
    const projectFindOptions: FindOptionsWhere<ProjectEntity> = { id: projectId };
    const favouriteFindOptions: FindOptionsWhere<ProjectFavouriteEntity> = {};

    const currentUser = getCurrentUser();
    projectFindOptions.client = { id: currentUser.clientId };

    if (!forAllUsers) {
      favouriteFindOptions.user = { id: currentUser.userId };
    }

    const project = await this.projectRepository.findOneOrFail({
      where: projectFindOptions,
    });

    favouriteFindOptions.project = { id: project.id };

    await this.favouriteRepository.delete(favouriteFindOptions);
  }
}
