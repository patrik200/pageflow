import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { Transactional } from "typeorm-transactional";
import { PermissionEntityType } from "@app/shared-enums";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ElasticDocumentData, ElasticService } from "@app/back-kit";

import { CorrespondenceEntity } from "entities/Correspondence/Correspondence";

import { PermissionAccessService } from "modules/permissions";
import { MoveCorrespondenceRevisionService } from "modules/correspondence-revisions";

import { GetCorrespondenceService } from "./get";
import { GetCorrespondenceGroupService } from "../groups/get";

interface MoveCorrespondenceData {
  movableCorrespondenceId: string;
  toGroupId: string | undefined;
}

@Injectable()
export class MoveCorrespondenceService {
  constructor(
    @InjectRepository(CorrespondenceEntity) private correspondenceRepository: Repository<CorrespondenceEntity>,
    private getCorrespondenceService: GetCorrespondenceService,
    private getCorrespondenceGroupService: GetCorrespondenceGroupService,
    @Inject(forwardRef(() => PermissionAccessService)) private permissionAccessService: PermissionAccessService,
    @Inject(forwardRef(() => MoveCorrespondenceRevisionService))
    private moveCorrespondenceRevisionService: MoveCorrespondenceRevisionService,
    private elasticService: ElasticService,
  ) {}

  @Transactional()
  async moveCorrespondenceOrFail(
    options: MoveCorrespondenceData,
    { checkPermissions = true }: { checkPermissions?: boolean } = {},
  ) {
    const movableCorrespondence = await this.getCorrespondenceService.getCorrespondenceOrFail(
      options.movableCorrespondenceId,
      { loadRevisions: true },
    );

    if (checkPermissions)
      await this.permissionAccessService.validateToEditOrDelete(
        { entityId: movableCorrespondence.id, entityType: PermissionEntityType.CORRESPONDENCE },
        true,
      );

    if (options.toGroupId) {
      const targetGroup = await this.getCorrespondenceGroupService.getGroupOrFail(options.toGroupId, {
        loadRootGroup: true,
        loadParentGroup: true,
      });

      await this.permissionAccessService.validateToEditOrDelete(
        { entityId: targetGroup.id, entityType: PermissionEntityType.CORRESPONDENCE_GROUP },
        true,
      );

      await this.correspondenceRepository.update(movableCorrespondence.id, {
        parentGroup: { id: targetGroup.id },
        rootGroup: { id: targetGroup.rootGroup.id },
      });

      await this.elasticService.updateDocumentOrFail(
        this.elasticService.getDocumentId("correspondences", movableCorrespondence.id, "correspondence"),
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
      await this.correspondenceRepository.update(movableCorrespondence.id, { parentGroup: null });

      await this.elasticService.updateDocumentOrFail(
        this.elasticService.getDocumentId("correspondences", movableCorrespondence.id, "correspondence"),
        Object.assign(
          {},
          this.elasticService.updateNullOrUndefined<string>(null, "parentGroupId"),
          this.elasticService.updateNullOrUndefined<string>(null, "parentGroupIdsPath"),
        ) as ElasticDocumentData,
      );
    }

    await Promise.all([
      ...movableCorrespondence.revisions.map((revision) =>
        this.moveCorrespondenceRevisionService.syncRootGroupId(revision.id),
      ),
      ...movableCorrespondence.revisions.map((revision) =>
        this.moveCorrespondenceRevisionService.syncParentGroupIdsPath(revision.id),
      ),
    ]);
  }
}
