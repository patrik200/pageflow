import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { PermissionEntityType } from "@app/shared-enums";

import { DocumentRevisionEntity } from "entities/Document/Document/Revision";

import { getCurrentUser } from "modules/auth";
import { PermissionAccessService } from "modules/permissions";

@Injectable()
export class GetDocumentRevisionForChangeStatusService {
  constructor(
    @InjectRepository(DocumentRevisionEntity) private revisionsRepository: Repository<DocumentRevisionEntity>,
    @Inject(forwardRef(() => PermissionAccessService)) private permissionAccessService: PermissionAccessService,
  ) {}

  async getRevisionForChangeStatus(revisionId: string, mode: "reader" | "editor") {
    const currentUser = getCurrentUser();
    const revision = await this.revisionsRepository.findOneOrFail({
      where: { id: revisionId, document: { client: { id: currentUser.clientId } } },
      relations: {
        document: {
          client: true,
        },
        author: true,
        responsibleUserApproving: {
          user: true,
        },
        responsibleUserFlowApproving: {
          revision: true,
          rows: {
            users: {
              user: true,
              files: {
                file: true,
              },
            },
          },
          reviewer: {
            user: true,
          },
        },
        comments: true,
      },
    });

    if (mode === "reader") {
      await this.permissionAccessService.validateToRead(
        { entityId: revision.document.id, entityType: PermissionEntityType.DOCUMENT },
        true,
      );
    }

    if (mode === "editor") {
      await this.permissionAccessService.validateToEditOrDelete(
        { entityId: revision.document.id, entityType: PermissionEntityType.DOCUMENT },
        true,
      );
    }

    revision.responsibleUserFlowApproving?.rows.sort((a, b) => a.index - b.index);
    revision.responsibleUserFlowApproving?.rows.forEach((row) => row.users.sort((a, b) => a.index - b.index));

    revision.calculateAllCans(currentUser);

    return revision;
  }
}
