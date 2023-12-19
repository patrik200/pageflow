import { PermissionEntityType } from "@app/shared-enums";
import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOptionsWhere, Repository } from "typeorm";

import { CorrespondenceGroupEntity } from "entities/Correspondence/Group/group";

import { getCurrentUser } from "modules/auth";
import { PermissionAccessService } from "modules/permissions";

import { GetCorrespondenceGroupIsFavouritesService } from "./favourites";

@Injectable()
export class GetCorrespondenceGroupService {
  constructor(
    @InjectRepository(CorrespondenceGroupEntity)
    private correspondenceGroupRepository: Repository<CorrespondenceGroupEntity>,
    private getCorrespondenceGroupIsFavouritesService: GetCorrespondenceGroupIsFavouritesService,
    @Inject(forwardRef(() => PermissionAccessService)) private permissionAccessService: PermissionAccessService,
  ) {}

  async getGroupOrFail(
    groupId: string,
    {
      loadFavourites,
      checkPermissions = true,
      loadPermissions,
      ...options
    }: {
      loadFavourites?: boolean;
      checkPermissions?: boolean;
      loadPermissions?: boolean;
      loadRootGroup?: boolean;
      loadParentGroup?: boolean;
      loadChildrenGroups?: boolean;
      loadChildrenCorrespondences?: boolean;
    } = {},
  ) {
    if (checkPermissions) {
      await this.permissionAccessService.validateToRead(
        { entityId: groupId, entityType: PermissionEntityType.CORRESPONDENCE_GROUP },
        true,
      );
    }

    const findOptions: FindOptionsWhere<CorrespondenceGroupEntity> = { id: groupId };
    findOptions.client = { id: getCurrentUser().clientId };

    const group = await this.correspondenceGroupRepository.findOneOrFail({
      where: findOptions,
      relations: {
        rootGroup: options.loadRootGroup,
        parentGroup: options.loadParentGroup,
        childrenGroups: options.loadChildrenGroups,
        childrenCorrespondences: options.loadChildrenCorrespondences,
      },
    });

    await Promise.all([
      loadFavourites && this.getCorrespondenceGroupIsFavouritesService.loadGroupIsFavourite(group),
      loadPermissions &&
        this.permissionAccessService.loadPermissions(
          { entityId: group.id, entityType: PermissionEntityType.CORRESPONDENCE_GROUP },
          group,
          { loadUser: true },
        ),
    ]);

    return group;
  }
}
