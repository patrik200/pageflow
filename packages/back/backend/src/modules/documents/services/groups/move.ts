import { ElasticDocumentData, ElasticService } from "@app/back-kit";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Transactional } from "typeorm-transactional";
import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { PermissionEntityType } from "@app/shared-enums";

import { DocumentGroupEntity } from "entities/Document/Group/group";

import { PermissionAccessService } from "modules/permissions";

import { GetDocumentGroupService } from "./get";

interface MoveDocumentGroupData {
  movableGroupId: string;
  toGroupId: string | undefined;
}

@Injectable()
export class MoveDocumentGroupService {
  constructor(
    @InjectRepository(DocumentGroupEntity) private documentGroupRepository: Repository<DocumentGroupEntity>,
    private getDocumentGroupService: GetDocumentGroupService,
    @Inject(forwardRef(() => PermissionAccessService)) private permissionAccessService: PermissionAccessService,
    private elasticService: ElasticService,
  ) {}

  @Transactional()
  async moveGroupOrFail(
    options: MoveDocumentGroupData,
    { checkPermissions = true }: { checkPermissions?: boolean } = {},
  ) {
    if (checkPermissions)
      await this.permissionAccessService.validateToEditOrDelete(
        { entityId: options.movableGroupId, entityType: PermissionEntityType.DOCUMENT_GROUP },
        true,
      );

    const movableGroup = await this.getDocumentGroupService.getGroupOrFail(options.movableGroupId);

    if (options.toGroupId) {
      const targetGroup = await this.getDocumentGroupService.getGroupOrFail(options.toGroupId, {
        loadRootGroup: true,
        loadParentGroup: true,
      });

      await this.permissionAccessService.validateToEditOrDelete(
        { entityId: targetGroup.id, entityType: PermissionEntityType.DOCUMENT_GROUP },
        true,
      );

      await this.documentGroupRepository.update(movableGroup.id, {
        parentGroup: { id: targetGroup.id },
        rootGroup: { id: targetGroup.rootGroup.id },
      });

      await this.elasticService.updateDocumentOrFail(
        this.elasticService.getDocumentId("documents", movableGroup.id, "document-group"),
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
      await this.documentGroupRepository.update(movableGroup.id, { parentGroup: null });

      await this.elasticService.updateDocumentOrFail(
        this.elasticService.getDocumentId("documents", movableGroup.id, "document-group"),
        Object.assign(
          {},
          this.elasticService.updateNullOrUndefined<string>(null, "parentGroupId"),
          this.elasticService.updateNullOrUndefined<string>(null, "parentGroupIdsPath"),
        ) as ElasticDocumentData,
      );
    }
  }
}
