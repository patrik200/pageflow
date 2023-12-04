import { ElasticDocumentData, ElasticService } from "@app/back-kit";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Transactional } from "typeorm-transactional";
import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { PermissionEntityType } from "@app/shared-enums";

import { DocumentEntity } from "entities/Document/Document";

import { MoveDocumentRevisionsService } from "modules/document-revisions";
import { PermissionAccessService } from "modules/permissions";

import { GetDocumentGroupService } from "../groups/get";
import { GetDocumentService } from "./get";

interface MoveDocumentData {
  movableDocumentId: string;
  toGroupId: string | undefined;
}

@Injectable()
export class MoveDocumentService {
  constructor(
    @InjectRepository(DocumentEntity) private documentRepository: Repository<DocumentEntity>,
    private getDocumentService: GetDocumentService,
    private getDocumentGroupService: GetDocumentGroupService,
    private elasticService: ElasticService,
    @Inject(forwardRef(() => MoveDocumentRevisionsService))
    private moveDocumentRevisionsService: MoveDocumentRevisionsService,
    @Inject(forwardRef(() => PermissionAccessService)) private permissionAccessService: PermissionAccessService,
  ) {}

  @Transactional()
  async moveDocumentOrFail(
    options: MoveDocumentData,
    { checkPermissions = true }: { checkPermissions?: boolean } = {},
  ) {
    const movableDocument = await this.getDocumentService.getDocumentOrFail(options.movableDocumentId, {
      loadRevisions: true,
    });

    if (checkPermissions)
      await this.permissionAccessService.validateToEditOrDelete(
        { entityId: movableDocument.id, entityType: PermissionEntityType.DOCUMENT },
        true,
      );

    if (options.toGroupId) {
      const targetGroup = await this.getDocumentGroupService.getGroupOrFail(options.toGroupId, {
        loadRootGroup: true,
        loadParentGroup: true,
      });

      await this.permissionAccessService.validateToEditOrDelete(
        { entityId: targetGroup.id, entityType: PermissionEntityType.DOCUMENT_GROUP },
        true,
      );

      await this.documentRepository.update(movableDocument.id, {
        parentGroup: { id: targetGroup.id },
        rootGroup: { id: targetGroup.rootGroup.id },
      });

      await this.elasticService.updateDocumentOrFail(
        this.elasticService.getDocumentId("documents", movableDocument.id, "document"),
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
      await this.documentRepository.update(movableDocument.id, { parentGroup: null });

      await this.elasticService.updateDocumentOrFail(
        this.elasticService.getDocumentId("documents", movableDocument.id, "document"),
        Object.assign(
          {},
          this.elasticService.updateNullOrUndefined<string>(null, "parentGroupId"),
          this.elasticService.updateNullOrUndefined<string>(null, "parentGroupIdsPath"),
        ) as ElasticDocumentData,
      );
    }

    await Promise.all([
      ...movableDocument.revisions.map((revision) => this.moveDocumentRevisionsService.syncRootGroupId(revision.id)),
      ...movableDocument.revisions.map((revision) =>
        this.moveDocumentRevisionsService.syncParentGroupIdsPath(revision.id),
      ),
    ]);
  }
}
