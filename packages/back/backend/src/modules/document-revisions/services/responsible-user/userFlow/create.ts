import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { DocumentRevisionEntity } from "entities/Document/Document/Revision";

import { GetDocumentService } from "modules/documents";

import { CloneDocumentRevisionUserFlowService } from "../../userFlow/clone";

@Injectable()
export class CreateDocumentRevisionResponsibleUserFlowService {
  constructor(
    @InjectRepository(DocumentRevisionEntity) private revisionsRepository: Repository<DocumentRevisionEntity>,
    private cloneDocumentRevisionUserFlowService: CloneDocumentRevisionUserFlowService,
    @Inject(forwardRef(() => GetDocumentService)) private getDocumentService: GetDocumentService,
  ) {}

  async createResponsibleUserFlowIfNeedOrFail(revisionId: string, userFlowId: string | null, documentId: string) {
    if (userFlowId) {
      const responsibleUserFlowId = await this.cloneDocumentRevisionUserFlowService.cloneFromRealUserFlowOrFail(
        userFlowId,
      );
      await this.revisionsRepository.update(revisionId, {
        responsibleUserFlowApproving: { id: responsibleUserFlowId },
      });
      return;
    }

    const document = await this.getDocumentService.getDocumentOrFail(documentId, {
      loadResponsibleUserFlow: true,
    });

    if (document.responsibleUserFlow) {
      const responsibleUserFlowId = await this.cloneDocumentRevisionUserFlowService.cloneFromRealUserFlowOrFail(
        document.responsibleUserFlow.id,
      );
      await this.revisionsRepository.update(revisionId, {
        responsibleUserFlowApproving: { id: responsibleUserFlowId },
      });
    }
  }
}
