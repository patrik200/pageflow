import { Injectable } from "@nestjs/common";
import { ServiceError } from "@app/back-kit";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Transactional } from "typeorm-transactional";
import { DocumentRevisionStatus } from "@app/shared-enums";

import { DocumentRevisionResponsibleUserEntity } from "entities/Document/Document/Revision/Approving/UserApproving";
import { DocumentRevisionResponsibleUserFlowRowUserEntity } from "entities/Document/Document/Revision/Approving/UserFlowApproving/Row/User";
import { DocumentRevisionResponsibleUserFlowReviewerEntity } from "entities/Document/Document/Revision/Approving/UserFlowApproving/Reviewer";
import { DocumentRevisionResponsibleUserFlowRowUserFileEntity } from "entities/Document/Document/Revision/Approving/UserFlowApproving/Row/User/File";
import { DocumentRevisionResponsibleUserFlowEntity } from "entities/Document/Document/Revision/Approving/UserFlowApproving";

import { DeleteFileService } from "modules/storage";

import { EditDocumentRevisionStatusesService } from "./edit-status";
import { GetDocumentRevisionForChangeStatusService } from "./get-for-change";

@Injectable()
export class ResetToInitialDocumentRevisionStatusesService {
  constructor(
    @InjectRepository(DocumentRevisionResponsibleUserEntity)
    private responsibleUserRepository: Repository<DocumentRevisionResponsibleUserEntity>,
    @InjectRepository(DocumentRevisionResponsibleUserFlowRowUserEntity)
    private responsibleUserFlowRowUserRepository: Repository<DocumentRevisionResponsibleUserFlowRowUserEntity>,
    @InjectRepository(DocumentRevisionResponsibleUserFlowRowUserFileEntity)
    private responsibleUserFlowRowUserFileRepository: Repository<DocumentRevisionResponsibleUserFlowRowUserFileEntity>,
    @InjectRepository(DocumentRevisionResponsibleUserFlowReviewerEntity)
    private responsibleUserFlowReviewerRepository: Repository<DocumentRevisionResponsibleUserFlowReviewerEntity>,
    @InjectRepository(DocumentRevisionResponsibleUserFlowEntity)
    private responsibleUserFlowRepository: Repository<DocumentRevisionResponsibleUserFlowEntity>,
    private getDocumentRevisionStatusesForChangeService: GetDocumentRevisionForChangeStatusService,
    private editDocumentRevisionStatusesService: EditDocumentRevisionStatusesService,
    private deleteFileService: DeleteFileService,
  ) {}

  @Transactional()
  async resetToInitialRevisionOrFail(
    revisionId: string,
    status: DocumentRevisionStatus.REVOKED | DocumentRevisionStatus.ARCHIVE,
  ) {
    const revision = await this.getDocumentRevisionStatusesForChangeService.getRevisionForChangeStatus(
      revisionId,
      "editor",
    );

    if (!revision.canMoveToRevokedStatus) throw new ServiceError("user", "Вы не можете отозвать эту ревизию");

    if (revision.responsibleUserApproving)
      await this.responsibleUserRepository.update(revision.responsibleUserApproving.id, {
        approved: false,
        comment: null,
      });

    if (revision.responsibleUserFlowApproving?.reviewer) {
      await this.responsibleUserFlowReviewerRepository.update(revision.responsibleUserFlowApproving.reviewer.id, {
        approved: false,
        comment: null,
      });
    }

    if (revision.responsibleUserFlowApproving) {
      await Promise.all([
        this.responsibleUserFlowRepository.update(revision.responsibleUserFlowApproving.id, {
          approvedDate: null,
        }),
        ...revision.responsibleUserFlowApproving.rows.flatMap((row) =>
          row.users.map(async (rowUser) => {
            await this.responsibleUserFlowRowUserRepository.update(rowUser.id, { approved: false });
            for (const rowUserFile of rowUser.files) {
              await this.responsibleUserFlowRowUserFileRepository.delete(rowUserFile.id);
              await this.deleteFileService.deleteFileOrFail(rowUserFile.file);
            }
          }),
        ),
      ]);
    }

    await this.editDocumentRevisionStatusesService.unsafeUpdateRevisionStatusOrFail(revision, {
      status,
      returnMessage: null,
      returnCodeKey: null,
    });
  }
}
