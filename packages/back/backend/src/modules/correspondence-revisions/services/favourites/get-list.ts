import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { In, Repository } from "typeorm";
import { Transactional } from "typeorm-transactional";
import { PermissionEntityType } from "@app/shared-enums";

import { CorrespondenceRevisionEntity } from "entities/Correspondence/Correspondence/Revision";
import { CorrespondenceRevisionFavouriteEntity } from "entities/Correspondence/Correspondence/Revision/Favourite";

import { getCurrentUser } from "modules/auth";
import { PermissionAccessService } from "modules/permissions";

@Injectable()
export class GetCorrespondenceRevisionFavouritesListService {
  constructor(
    @InjectRepository(CorrespondenceRevisionEntity)
    private revisionRepository: Repository<CorrespondenceRevisionEntity>,
    @InjectRepository(CorrespondenceRevisionFavouriteEntity)
    private favouriteRepository: Repository<CorrespondenceRevisionFavouriteEntity>,
    @Inject(forwardRef(() => PermissionAccessService)) private permissionAccessService: PermissionAccessService,
  ) {}

  @Transactional()
  async getFavouritesOrFail(options: { loadAuthor?: boolean; loadAuthorAvatar?: boolean } = {}) {
    const currentUser = getCurrentUser();
    const favourites = await this.favouriteRepository.find({
      where: { user: { id: currentUser.userId } },
      relations: { revision: true },
    });

    const revisions = await this.revisionRepository.find({
      withDeleted: true,
      where: { id: In(favourites.map((favourite) => favourite.revision.id)) },
      relations: {
        author: options.loadAuthor ? { avatar: options.loadAuthorAvatar } : undefined,
        correspondence: true,
      },
    });

    revisions.forEach((revision) => revision.calculateAllCans(currentUser));

    const revisionsWithPermissions = await Promise.all(
      revisions.map(async (revision) => ({
        revision,
        hasAccess: await this.permissionAccessService.validateToRead(
          { entityId: revision.correspondence.id, entityType: PermissionEntityType.CORRESPONDENCE },
          false,
        ),
      })),
    );

    return revisionsWithPermissions.filter(({ hasAccess }) => hasAccess).map(({ revision }) => revision);
  }
}
