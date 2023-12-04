import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { DocumentRevisionEntity } from "entities/Document/Document/Revision";
import { DocumentRevisionResponsibleUserFlowEntity } from "entities/Document/Document/Revision/Approving/UserFlowApproving";
import { DocumentRevisionResponsibleUserFlowReviewerEntity } from "entities/Document/Document/Revision/Approving/UserFlowApproving/Reviewer";
import { DocumentRevisionResponsibleUserFlowRowEntity } from "entities/Document/Document/Revision/Approving/UserFlowApproving/Row";
import { DocumentRevisionResponsibleUserFlowRowUserEntity } from "entities/Document/Document/Revision/Approving/UserFlowApproving/Row/User";
import { DocumentRevisionResponsibleUserFlowRowUserFileEntity } from "entities/Document/Document/Revision/Approving/UserFlowApproving/Row/User/File";

import { getCurrentUser } from "modules/auth";
import { DeleteFileService } from "modules/storage";

import { GetDocumentRevisionInitialStatusService } from "../../statuses/get-initial-status";

@Injectable()
export class DeleteDocumentRevisionResponsibleUserFlowService {
  constructor(
    @InjectRepository(DocumentRevisionEntity) private revisionsRepository: Repository<DocumentRevisionEntity>,
    @InjectRepository(DocumentRevisionResponsibleUserFlowEntity)
    private responsibleUserFlowRepository: Repository<DocumentRevisionResponsibleUserFlowEntity>,
    @InjectRepository(DocumentRevisionResponsibleUserFlowReviewerEntity)
    private responsibleUserFlowReviewerRepository: Repository<DocumentRevisionResponsibleUserFlowReviewerEntity>,
    @InjectRepository(DocumentRevisionResponsibleUserFlowRowEntity)
    private responsibleUserFlowRowRepository: Repository<DocumentRevisionResponsibleUserFlowRowEntity>,
    @InjectRepository(DocumentRevisionResponsibleUserFlowRowUserEntity)
    private responsibleUserFlowRowUserRepository: Repository<DocumentRevisionResponsibleUserFlowRowUserEntity>,
    @InjectRepository(DocumentRevisionResponsibleUserFlowRowUserFileEntity)
    private responsibleUserFlowRowUserFileRepository: Repository<DocumentRevisionResponsibleUserFlowRowUserFileEntity>,
    private getDocumentRevisionStatusesService: GetDocumentRevisionInitialStatusService,
    @Inject(forwardRef(() => DeleteFileService)) private deleteFileService: DeleteFileService,
  ) {}

  async deleteResponsibleUserFlowIfNeedOrFail(revisionId: string) {
    const revision = await this.revisionsRepository.findOneOrFail({
      where: { id: revisionId, document: { client: { id: getCurrentUser().clientId } } },
      relations: {
        document: true,
        responsibleUserFlowApproving: {
          reviewer: true,
          rows: {
            users: {
              files: {
                file: true,
              },
            },
          },
        },
      },
    });

    if (!revision.responsibleUserFlowApproving) return;

    await this.revisionsRepository.update(revision.id, {
      responsibleUserFlowApproving: null,
      status: this.getDocumentRevisionStatusesService.getInitialStatus(revision.document.status),
    });

    for (const row of revision.responsibleUserFlowApproving.rows) {
      for (const rowUser of row.users) {
        for (const rowUserFile of rowUser.files) {
          await this.responsibleUserFlowRowUserFileRepository.delete(rowUserFile.id);
          await this.deleteFileService.deleteFileOrFail(rowUserFile.file);
        }
        await this.responsibleUserFlowRowUserRepository.delete(rowUser.id);
      }
      await this.responsibleUserFlowRowRepository.delete(row.id);
    }

    if (revision.responsibleUserFlowApproving.reviewer) {
      await this.responsibleUserFlowReviewerRepository.delete(revision.responsibleUserFlowApproving.reviewer.id);
    }

    await this.responsibleUserFlowRepository.delete(revision.responsibleUserFlowApproving.id);
  }
}
