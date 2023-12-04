import { DocumentRevisionStatus, DocumentRevisionArchivedAutomaticallyStatuses } from "@app/shared-enums";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Transactional } from "typeorm-transactional";

import { DocumentRevisionEntity } from "entities/Document/Document/Revision";

import { getCurrentUser } from "modules/auth";

import { EditDocumentRevisionStatusService } from "./edit-status";

@Injectable()
export class DocumentRevisionArchiveAutomaticallyService {
  constructor(
    @InjectRepository(DocumentRevisionEntity)
    private revisionsRepository: Repository<DocumentRevisionEntity>,
    private editDocumentRevisionStatusService: EditDocumentRevisionStatusService,
  ) {}

  @Transactional()
  async unsafeRevisionArchiveAutomaticallyOrFail(revisionId: string) {
    const currentUser = getCurrentUser();
    const revision = await this.revisionsRepository.findOneOrFail({
      where: { id: revisionId, document: { client: { id: currentUser.clientId } } },
      relations: { document: { client: true }, responsibleUserApproving: { user: true } },
    });

    if (DocumentRevisionArchivedAutomaticallyStatuses.includes(revision.status)) return;

    const newStatus =
      revision.status === DocumentRevisionStatus.ARCHIVE
        ? DocumentRevisionStatus.ARCHIVED_AUTOMATICALLY_RESTORE_ARCHIVE
        : DocumentRevisionStatus.ARCHIVED_AUTOMATICALLY_RESTORE_INITIAL;

    await this.editDocumentRevisionStatusService.dangerUpdateRevisionStatus(revision.id, newStatus);
  }
}
