import { forwardRef, HttpStatus, Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ServiceError } from "@app/back-kit";
import { Repository } from "typeorm";
import { Transactional } from "typeorm-transactional";

import { DocumentEntity } from "entities/Document/Document";

import { GetCorrespondenceService } from "modules/correspondences";

import { GetDocumentService } from "../get";

@Injectable()
export class CreateDocumentDependencyService {
  constructor(
    @InjectRepository(DocumentEntity) private documentsRepository: Repository<DocumentEntity>,
    @Inject(forwardRef(() => GetCorrespondenceService)) private getCorrespondenceService: GetCorrespondenceService,
    @Inject(forwardRef(() => GetDocumentService)) private getDocumentService: GetDocumentService,
  ) {}

  @Transactional()
  async dependDocumentOnCorrespondence(documentId: string, correspondenceId: string) {
    const document = await this.getDocumentService.getDocumentOrFail(documentId, {
      loadDependsOnCorrespondences: true,
    });
    const correspondence = await this.getCorrespondenceService.getCorrespondenceOrFail(correspondenceId);

    if (document.dependsOnCorrespondences.find((corr) => corr.id === correspondence.id)) {
      throw new ServiceError("document", "Документ уже зависит от этой корреспонденции", HttpStatus.NOT_MODIFIED);
    }

    await this.documentsRepository
      .createQueryBuilder()
      .relation(DocumentEntity, "dependsOnCorrespondences")
      .of(document.id)
      .add(correspondence.id);
  }
}
