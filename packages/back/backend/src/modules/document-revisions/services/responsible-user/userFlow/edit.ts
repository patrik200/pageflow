import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { PermissionEntityType, PermissionRole } from "@app/shared-enums";

import { DocumentRevisionEntity } from "entities/Document/Document/Revision";
import { DocumentRevisionResponsibleUserFlowEntity } from "entities/Document/Document/Revision/Approving/UserFlowApproving";

import { getCurrentUser } from "modules/auth";
import { CreatePermissionService } from "modules/permissions";

import { GetDocumentRevisionInitialStatusService } from "../../statuses/get-initial-status";
import { CloneDocumentRevisionUserFlowService } from "../../userFlow/clone";
import { DeleteDocumentRevisionResponsibleUserFlowService } from "./delete";

@Injectable()
export class EditDocumentRevisionResponsibleUserFlowService {
  constructor(
    @InjectRepository(DocumentRevisionEntity) private revisionsRepository: Repository<DocumentRevisionEntity>,
    @InjectRepository(DocumentRevisionResponsibleUserFlowEntity)
    private revisionUserFlowRepository: Repository<DocumentRevisionResponsibleUserFlowEntity>,
    private cloneDocumentRevisionUserFlowService: CloneDocumentRevisionUserFlowService,
    private getDocumentRevisionStatusesService: GetDocumentRevisionInitialStatusService,
    private deleteDocumentRevisionResponsibleUserFlowService: DeleteDocumentRevisionResponsibleUserFlowService,
    @Inject(forwardRef(() => CreatePermissionService)) private createPermissionService: CreatePermissionService,
  ) {}

  async unsafeUpdateResponsibleUserFlowIfNeedOrFail(revisionId: string, userFlowId: string | null) {
    if (userFlowId === null) {
      await this.deleteDocumentRevisionResponsibleUserFlowService.deleteResponsibleUserFlowIfNeedOrFail(revisionId);
      return;
    }

    const revision = await this.revisionsRepository.findOneOrFail({
      where: { id: revisionId, document: { client: { id: getCurrentUser().clientId } } },
      relations: { document: { client: true } },
    });

    if (revision.responsibleUserFlowApproving)
      await this.deleteDocumentRevisionResponsibleUserFlowService.deleteResponsibleUserFlowIfNeedOrFail(revision.id);

    const responsibleUserFlowId = await this.cloneDocumentRevisionUserFlowService.cloneFromRealUserFlowOrFail(
      userFlowId,
    );

    await this.revisionsRepository.update(revisionId, {
      responsibleUserFlowApproving: { id: responsibleUserFlowId },
      status: this.getDocumentRevisionStatusesService.getInitialStatus(revision.document.status),
    });

    const revisionUserFlow = await this.revisionUserFlowRepository.findOneOrFail({
      where: { id: responsibleUserFlowId },
      relations: {
        reviewer: { user: true },
        rows: { users: { user: true } },
      },
    });

    await Promise.all([
      revisionUserFlow.reviewer &&
        this.createPermissionService.createPermissionOrFail(
          { entityId: revision.document.id, entityType: PermissionEntityType.DOCUMENT },
          { userId: revisionUserFlow.reviewer.user.id, role: PermissionRole.READER },
          { validateCurrentUserPermissions: false },
        ),
      ...revisionUserFlow.rows.map((row) =>
        Promise.all(
          row.users.map((rowUser) =>
            this.createPermissionService.createPermissionOrFail(
              { entityId: revision.document.id, entityType: PermissionEntityType.DOCUMENT },
              { userId: rowUser.user.id, role: PermissionRole.READER },
              { validateCurrentUserPermissions: false },
            ),
          ),
        ),
      ),
    ]);
  }
}
