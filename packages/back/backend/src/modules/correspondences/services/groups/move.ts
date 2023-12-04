import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { Transactional } from "typeorm-transactional";
import { PermissionEntityType } from "@app/shared-enums";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ElasticDocumentData, ElasticService } from "@app/back-kit";

import { CorrespondenceGroupEntity } from "entities/Correspondence/Group/group";

import { PermissionAccessService } from "modules/permissions";

import { GetCorrespondenceGroupService } from "./get";

interface MoveCorrespondenceGroupData {
  movableGroupId: string;
  toGroupId: string | undefined;
}

@Injectable()
export class MoveCorrespondenceGroupService {
  constructor(
    @InjectRepository(CorrespondenceGroupEntity)
    private correspondenceGroupRepository: Repository<CorrespondenceGroupEntity>,
    private getCorrespondenceGroupService: GetCorrespondenceGroupService,
    @Inject(forwardRef(() => PermissionAccessService)) private permissionAccessService: PermissionAccessService,
    private elasticService: ElasticService,
  ) {}

  @Transactional()
  async moveGroupOrFail(
    options: MoveCorrespondenceGroupData,
    { checkPermissions = true }: { checkPermissions?: boolean } = {},
  ) {
    if (checkPermissions)
      await this.permissionAccessService.validateToEditOrDelete(
        { entityId: options.movableGroupId, entityType: PermissionEntityType.CORRESPONDENCE_GROUP },
        true,
      );

    const movableGroup = await this.getCorrespondenceGroupService.getGroupOrFail(options.movableGroupId);

    if (options.toGroupId) {
      const targetGroup = await this.getCorrespondenceGroupService.getGroupOrFail(options.toGroupId, {
        loadRootGroup: true,
        loadParentGroup: true,
      });

      await this.permissionAccessService.validateToEditOrDelete(
        { entityId: targetGroup.id, entityType: PermissionEntityType.CORRESPONDENCE_GROUP },
        true,
      );

      await this.correspondenceGroupRepository.update(movableGroup.id, {
        parentGroup: { id: targetGroup.id },
        rootGroup: { id: targetGroup.rootGroup.id },
      });

      await this.elasticService.updateDocumentOrFail(
        this.elasticService.getDocumentId("correspondences", movableGroup.id, "correspondence-group"),
        Object.assign(
          {},
          this.elasticService.updateNullOrUndefined<string>(targetGroup.id, "parentGroupId"),
          this.elasticService.updateNullOrUndefined<string>(targetGroup.rootGroup.id, "rootGroupId"),
          this.elasticService.updateNullOrUndefined<string>(
            this.elasticService.getHierarchyPath(targetGroup.path),
            "parentGroupIdsPath",
          ),
        ) as ElasticDocumentData,
      );
    } else {
      await this.correspondenceGroupRepository.update(movableGroup.id, { parentGroup: null });

      await this.elasticService.updateDocumentOrFail(
        this.elasticService.getDocumentId("correspondences", movableGroup.id, "correspondence-group"),
        Object.assign(
          {},
          this.elasticService.updateNullOrUndefined<string>(null, "parentGroupId"),
          this.elasticService.updateNullOrUndefined<string>(null, "parentGroupIdsPath"),
        ) as ElasticDocumentData,
      );
    }
  }
}
