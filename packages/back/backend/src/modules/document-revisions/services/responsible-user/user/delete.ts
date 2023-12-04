import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { DocumentRevisionEntity } from "entities/Document/Document/Revision";
import { DocumentRevisionResponsibleUserEntity } from "entities/Document/Document/Revision/Approving/UserApproving";

import { getCurrentUser } from "modules/auth";

import { GetDocumentRevisionInitialStatusService } from "../../statuses/get-initial-status";

@Injectable()
export class DeleteDocumentRevisionResponsibleUserService {
  constructor(
    @InjectRepository(DocumentRevisionEntity) private revisionsRepository: Repository<DocumentRevisionEntity>,
    @InjectRepository(DocumentRevisionResponsibleUserEntity)
    private revisionResponsibleUserRepository: Repository<DocumentRevisionResponsibleUserEntity>,
    private getDocumentRevisionStatusesService: GetDocumentRevisionInitialStatusService,
  ) {}

  async deleteResponsibleUserIfNeedOrFail(revisionId: string) {
    const revision = await this.revisionsRepository.findOneOrFail({
      where: { id: revisionId, document: { client: { id: getCurrentUser().clientId } } },
      relations: { responsibleUserApproving: true, document: true },
    });

    if (!revision.responsibleUserApproving) return;

    await this.revisionsRepository.update(revision.id, {
      responsibleUserApproving: null,
      status: this.getDocumentRevisionStatusesService.getInitialStatus(revision.document.status),
    });
    await this.revisionResponsibleUserRepository.delete(revision.responsibleUserApproving.id);
  }
}
