import { ElasticService } from "@app/back-kit";
import { DocumentRevisionStatus } from "@app/shared-enums";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { DocumentRevisionEntity } from "entities/Document/Document/Revision";

@Injectable()
export class EditDocumentRevisionStatusService {
  constructor(
    @InjectRepository(DocumentRevisionEntity)
    private revisionsRepository: Repository<DocumentRevisionEntity>,
    private elasticService: ElasticService,
  ) {}

  async dangerUpdateRevisionStatus(revisionId: string, newStatus: DocumentRevisionStatus) {
    await Promise.all([
      this.revisionsRepository.update(revisionId, { status: newStatus }),
      this.elasticService.updateDocumentOrFail(this.elasticService.getDocumentId("document-revisions", revisionId), {
        status: newStatus,
      }),
    ]);
  }
}
