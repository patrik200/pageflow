import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Transactional } from "typeorm-transactional";

import { DocumentEntity } from "entities/Document/Document";

import { GetCorrespondenceService } from "modules/correspondences";

import { GetDocumentService } from "../get";

@Injectable()
export class DeleteDocumentDependencyService {
  constructor(
    @InjectRepository(DocumentEntity) private documentsRepository: Repository<DocumentEntity>,
    @Inject(forwardRef(() => GetCorrespondenceService)) private getCorrespondenceService: GetCorrespondenceService,
    @Inject(forwardRef(() => GetDocumentService)) private getDocumentService: GetDocumentService,
  ) {}

  @Transactional()
  async undependFromCorrespondence(documentId: string, correspondenceId: string) {
    const document = await this.getDocumentService.getDocumentOrFail(documentId, {
      loadDependsOnCorrespondences: true,
    });
    const correspondence = await this.getCorrespondenceService.getCorrespondenceOrFail(correspondenceId);

    await this.documentsRepository
      .createQueryBuilder()
      .relation(DocumentEntity, "dependsOnCorrespondences")
      .of(document.id)
      .remove(correspondence.id);
  }
}
