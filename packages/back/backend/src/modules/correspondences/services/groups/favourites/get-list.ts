import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { In, Repository } from "typeorm";
import { Transactional } from "typeorm-transactional";
import { PermissionEntityType } from "@app/shared-enums";

import { CorrespondenceGroupEntity } from "entities/Correspondence/Group/group";
import { CorrespondenceGroupFavouriteEntity } from "entities/Correspondence/Group/Favourite";

import { getCurrentUser } from "modules/auth";
import { PermissionAccessService } from "modules/permissions";

@Injectable()
export class GetCorrespondenceGroupFavouritesListService {
  constructor(
    @InjectRepository(CorrespondenceGroupEntity)
    private groupRepository: Repository<CorrespondenceGroupEntity>,
    @InjectRepository(CorrespondenceGroupFavouriteEntity)
    private groupFavouriteRepository: Repository<CorrespondenceGroupFavouriteEntity>,
    @Inject(forwardRef(() => PermissionAccessService)) private permissionAccessService: PermissionAccessService,
  ) {}

  @Transactional()
  async getGroupFavouritesOrFail(options: { loadAuthor?: boolean; loadAuthorAvatar?: boolean } = {}) {
    const favourites = await this.groupFavouriteRepository.find({
      where: { user: { id: getCurrentUser().userId } },
      relations: { group: true },
    });

    const groups = await this.groupRepository.find({
      withDeleted: true,
      where: { id: In(favourites.map((favourite) => favourite.group.id)) },
      relations: {
        author: options.loadAuthor
          ? {
              avatar: options.loadAuthorAvatar,
            }
          : false,
      },
    });

    const groupsWithPermissions = await Promise.all(
      groups.map(async (group) => ({
        group,
        hasAccess: await this.permissionAccessService.validateToRead(
          { entityId: group.id, entityType: PermissionEntityType.CORRESPONDENCE_GROUP },
          false,
        ),
      })),
    );

    return groupsWithPermissions.filter(({ hasAccess }) => hasAccess).map(({ group }) => group);
  }
}
