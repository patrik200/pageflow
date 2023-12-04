import { forwardRef, HttpStatus, Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ServiceError } from "@app/back-kit";
import { Repository } from "typeorm";
import { Transactional } from "typeorm-transactional";

import { CorrespondenceEntity } from "entities/Correspondence/Correspondence";

import { GetDocumentService } from "modules/documents";

import { GetCorrespondenceService } from "../get";

@Injectable()
export class CreateCorrespondenceDependencyService {
  constructor(
    @InjectRepository(CorrespondenceEntity) private correspondenceRepository: Repository<CorrespondenceEntity>,
    private getCorrespondenceService: GetCorrespondenceService,
    @Inject(forwardRef(() => GetDocumentService)) private getDocumentService: GetDocumentService,
  ) {}

  @Transactional()
  async dependCorrespondenceOnDocument(correspondenceId: string, documentId: string) {
    const correspondence = await this.getCorrespondenceService.getCorrespondenceOrFail(correspondenceId, {
      loadDependsOnDocument: true,
    });

    const document = await this.getDocumentService.getDocumentOrFail(documentId);

    if (correspondence.dependsOnDocuments.find((doc) => doc.id === document.id)) {
      throw new ServiceError("document", "Документ уже зависит от этой корреспонденции", HttpStatus.NOT_MODIFIED);
    }

    await this.correspondenceRepository
      .createQueryBuilder()
      .relation(CorrespondenceEntity, "dependsOnDocuments")
      .of(correspondence.id)
      .add(document.id);
  }
}
