import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { Transactional } from "typeorm-transactional";
import { PermissionEntityType } from "@app/shared-enums";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { CorrespondenceGroupEntity } from "entities/Correspondence/Group/group";

import { DeletePermissionService, PermissionAccessService } from "modules/permissions";

import { RemoveCorrespondenceGroupFavouritesService } from "./favourites";
import { DeleteCorrespondenceGroupElasticService } from "./elastic";
import { GetCorrespondenceGroupService } from "./get";
import { DeleteCorrespondenceService } from "../correspondences/delete";

@Injectable()
export class DeleteCorrespondenceGroupService {
  constructor(
    @InjectRepository(CorrespondenceGroupEntity)
    private correspondenceGroupRepository: Repository<CorrespondenceGroupEntity>,
    private getCorrespondenceGroupService: GetCorrespondenceGroupService,
    private deleteCorrespondenceService: DeleteCorrespondenceService,
    private deleteCorrespondenceGroupElasticService: DeleteCorrespondenceGroupElasticService,
    private removeCorrespondenceGroupFavouritesService: RemoveCorrespondenceGroupFavouritesService,
    @Inject(forwardRef(() => PermissionAccessService)) private permissionAccessService: PermissionAccessService,
    @Inject(forwardRef(() => DeletePermissionService)) private deletePermissionService: DeletePermissionService,
  ) {}

  @Transactional()
  async deleteGroupOrFail(groupId: string, { checkPermissions = true }: { checkPermissions?: boolean } = {}) {
    if (checkPermissions) {
      await this.permissionAccessService.validateToEditOrDelete(
        { entityId: groupId, entityType: PermissionEntityType.CORRESPONDENCE_GROUP },
        true,
      );
    }

    const group = await this.getCorrespondenceGroupService.getGroupOrFail(groupId, {
      checkPermissions,
      loadChildrenGroups: true,
      loadChildrenCorrespondences: true,
    });

    await Promise.all([
      ...group.childrenGroups.map(({ id }) => this.deleteGroupOrFail(id, { checkPermissions: false })),
      ...group.childrenCorrespondences.map(({ id }) =>
        this.deleteCorrespondenceService.deleteCorrespondenceOrFail(id, { checkPermissions: false }),
      ),
      this.removeCorrespondenceGroupFavouritesService.removeGroupFavouriteOrFail(group.id),
      this.deleteCorrespondenceGroupElasticService.elasticDeleteGroupIndexOrFail(group.id),
    ]);

    await this.deletePermissionService.deleteAllPermissionsOrFail({
      entityId: group.id,
      entityType: PermissionEntityType.CORRESPONDENCE_GROUP,
    });

    await this.correspondenceGroupRepository.delete(group.id);
  }
}
