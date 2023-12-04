import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { PermissionEntityType, PermissionRole } from "@app/shared-enums";

import { DocumentRevisionEntity } from "entities/Document/Document/Revision";
import { DocumentRevisionResponsibleUserEntity } from "entities/Document/Document/Revision/Approving/UserApproving";

import { getCurrentUser } from "modules/auth";
import { GetUserService } from "modules/users";
import { CreatePermissionService } from "modules/permissions";

import { GetDocumentRevisionInitialStatusService } from "../../statuses/get-initial-status";
import { DeleteDocumentRevisionResponsibleUserService } from "./delete";

@Injectable()
export class EditDocumentRevisionResponsibleUserService {
  constructor(
    @InjectRepository(DocumentRevisionEntity) private revisionsRepository: Repository<DocumentRevisionEntity>,
    @InjectRepository(DocumentRevisionResponsibleUserEntity)
    private revisionResponsibleUserRepository: Repository<DocumentRevisionResponsibleUserEntity>,
    @Inject(forwardRef(() => GetUserService)) private getUserService: GetUserService,
    private getDocumentRevisionStatusesService: GetDocumentRevisionInitialStatusService,
    private deleteDocumentRevisionResponsibleUserService: DeleteDocumentRevisionResponsibleUserService,
    @Inject(forwardRef(() => CreatePermissionService)) private createPermissionService: CreatePermissionService,
  ) {}

  async unsafeUpdateResponsibleUserIfNeedOrFail(revisionId: string, userId: string | null) {
    if (userId === null) {
      await this.deleteDocumentRevisionResponsibleUserService.deleteResponsibleUserIfNeedOrFail(revisionId);
      return;
    }

    const revision = await this.revisionsRepository.findOneOrFail({
      where: { id: revisionId, document: { client: { id: getCurrentUser().clientId } } },
      relations: { document: { client: true }, responsibleUserApproving: true },
    });

    const user = await this.getUserService.getUserOrFail(userId, "id");

    if (revision.responsibleUserApproving)
      await this.deleteDocumentRevisionResponsibleUserService.deleteResponsibleUserIfNeedOrFail(revision.id);

    const userApproving = await this.revisionResponsibleUserRepository.save({
      user: { id: user.id },
      revision: { id: revision.id },
    });

    await this.revisionsRepository.update(revision.id, {
      responsibleUserApproving: { id: userApproving.id },
      status: this.getDocumentRevisionStatusesService.getInitialStatus(revision.document.status),
    });

    await this.createPermissionService.createPermissionOrFail(
      { entityId: revision.document.id, entityType: PermissionEntityType.DOCUMENT },
      { userId: user.id, role: PermissionRole.READER },
      { validateCurrentUserPermissions: false },
    );
  }
}
