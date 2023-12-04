import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { In, Repository } from "typeorm";
import { Transactional } from "typeorm-transactional";
import { PermissionEntityType } from "@app/shared-enums";

import { CorrespondenceEntity } from "entities/Correspondence/Correspondence";
import { CorrespondenceFavouriteEntity } from "entities/Correspondence/Correspondence/Favourite";

import { getCurrentUser } from "modules/auth";
import { PermissionAccessService } from "modules/permissions";

@Injectable()
export class GetCorrespondenceFavouritesListService {
  constructor(
    @InjectRepository(CorrespondenceEntity) private correspondenceRepository: Repository<CorrespondenceEntity>,
    @InjectRepository(CorrespondenceFavouriteEntity)
    private correspondenceFavouriteRepository: Repository<CorrespondenceFavouriteEntity>,
    @Inject(forwardRef(() => PermissionAccessService)) private permissionAccessService: PermissionAccessService,
  ) {}

  @Transactional()
  async getCorrespondenceFavouritesOrFail(options: { loadAuthor?: boolean; loadAuthorAvatar?: boolean } = {}) {
    const favourites = await this.correspondenceFavouriteRepository.find({
      where: { user: { id: getCurrentUser().userId } },
      relations: { correspondence: true },
    });

    const correspondences = await this.correspondenceRepository.find({
      withDeleted: true,
      where: { id: In(favourites.map((favourite) => favourite.correspondence.id)) },
      relations: {
        author: options.loadAuthor
          ? {
              avatar: options.loadAuthorAvatar,
            }
          : false,
      },
    });

    const correspondencesWithPermissions = await Promise.all(
      correspondences.map(async (correspondence) => ({
        correspondence,
        hasAccess: await this.permissionAccessService.validateToRead(
          { entityId: correspondence.id, entityType: PermissionEntityType.CORRESPONDENCE },
          false,
        ),
      })),
    );

    return correspondencesWithPermissions
      .filter(({ hasAccess }) => hasAccess)
      .map(({ correspondence }) => correspondence);
  }
}
