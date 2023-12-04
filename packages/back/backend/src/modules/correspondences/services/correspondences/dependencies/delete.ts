import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Transactional } from "typeorm-transactional";
import { PermissionEntityType } from "@app/shared-enums";

import { CorrespondenceEntity } from "entities/Correspondence/Correspondence";

import { GetDocumentService } from "modules/documents";
import { PermissionAccessService } from "modules/permissions";

import { GetCorrespondenceService } from "../get";

@Injectable()
export class DeleteCorrespondenceDependencyService {
  constructor(
    @InjectRepository(CorrespondenceEntity) private correspondenceRepository: Repository<CorrespondenceEntity>,
    private getCorrespondenceService: GetCorrespondenceService,
    @Inject(forwardRef(() => GetDocumentService)) private getDocumentService: GetDocumentService,
    @Inject(forwardRef(() => PermissionAccessService)) private permissionAccessService: PermissionAccessService,
  ) {}

  @Transactional()
  async deleteDependencyFromCorrespondence(dependencyDocumentId: string, correspondenceId: string) {
    const correspondence = await this.getCorrespondenceService.getCorrespondenceOrFail(correspondenceId, {
      loadDependsOnDocument: true,
    });

    await this.permissionAccessService.validateToEditOrDelete(
      { entityId: correspondence.id, entityType: PermissionEntityType.CORRESPONDENCE },
      true,
    );

    const document = await this.getDocumentService.getDocumentOrFail(dependencyDocumentId);

    await this.correspondenceRepository
      .createQueryBuilder()
      .relation(CorrespondenceEntity, "dependsOnDocuments")
      .of(correspondence.id)
      .remove(document.id);
  }
}
