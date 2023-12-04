import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { In, Repository } from "typeorm";
import { Transactional } from "typeorm-transactional";
import { PermissionEntityType } from "@app/shared-enums";

import { ProjectEntity } from "entities/Project";
import { ProjectFavouriteEntity } from "entities/Project/Favourite";

import { getCurrentUser } from "modules/auth";
import { PermissionAccessService } from "modules/permissions";

@Injectable()
export class GetProjectFavouritesListService {
  constructor(
    @InjectRepository(ProjectEntity)
    private projectRepository: Repository<ProjectEntity>,
    @InjectRepository(ProjectFavouriteEntity)
    private favouriteRepository: Repository<ProjectFavouriteEntity>,
    @Inject(forwardRef(() => PermissionAccessService)) private permissionAccessService: PermissionAccessService,
  ) {}

  @Transactional()
  async getFavouritesOrFail(options: { loadAuthor?: boolean; loadAuthorAvatar?: boolean } = {}) {
    const favourites = await this.favouriteRepository.find({
      where: { user: { id: getCurrentUser().userId } },
      relations: { project: true },
    });

    const projects = await this.projectRepository.find({
      withDeleted: true,
      where: { id: In(favourites.map((favourite) => favourite.project.id)) },
      relations: {
        author: options.loadAuthor
          ? {
              avatar: options.loadAuthorAvatar,
            }
          : false,
      },
    });

    const projectsWithPermissions = await Promise.all(
      projects.map(async (project) => ({
        project,
        hasAccess: await this.permissionAccessService.validateToRead(
          { entityId: project.id, entityType: PermissionEntityType.PROJECT },
          false,
        ),
      })),
    );

    return projectsWithPermissions.filter(({ hasAccess }) => hasAccess).map(({ project }) => project);
  }
}
