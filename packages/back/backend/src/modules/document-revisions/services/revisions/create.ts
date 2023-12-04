import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Transactional } from "typeorm-transactional";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { PermissionEntityType } from "@app/shared-enums";

import { DocumentRevisionEntity } from "entities/Document/Document/Revision";

import { GetDocumentService } from "modules/documents";
import { PermissionAccessService } from "modules/permissions";

import { CreateDocumentRevisionResponsibleUserService } from "../responsible-user/user/create";
import { CreateDocumentRevisionResponsibleUserFlowService } from "../responsible-user/userFlow/create";
import { EditDocumentRevisionStatusesService } from "../statuses/edit-status";
import { GetDocumentRevisionInitialStatusService } from "../statuses/get-initial-status";
import { CreateDocumentRevisionsElasticService } from "./create-elastic";
import { DocumentRevisionCreated } from "../../events/RevisionCreated";

interface CreateRevisionData {
  number: string;
  authorId: string;
  responsibleUserId?: string;
  responsibleUserFlowId?: string;
  approvingDeadline?: Date;
  canProlongApprovingDeadline?: boolean;
}

@Injectable()
export class CreateDocumentRevisionsService {
  constructor(
    @InjectRepository(DocumentRevisionEntity) private revisionsRepository: Repository<DocumentRevisionEntity>,
    @Inject(forwardRef(() => GetDocumentService)) private getDocumentService: GetDocumentService,
    private getDocumentRevisionStatusesService: GetDocumentRevisionInitialStatusService,
    private editDocumentRevisionStatusesService: EditDocumentRevisionStatusesService,
    private createDocumentRevisionResponsibleUserService: CreateDocumentRevisionResponsibleUserService,
    private createDocumentRevisionResponsibleUserFlowService: CreateDocumentRevisionResponsibleUserFlowService,
    private eventEmitter: EventEmitter2,
    private createDocumentRevisionsElasticService: CreateDocumentRevisionsElasticService,
    @Inject(forwardRef(() => PermissionAccessService)) private permissionAccessService: PermissionAccessService,
  ) {}

  @Transactional()
  async createRevisionOrFail(documentId: string, data: CreateRevisionData) {
    const document = await this.getDocumentService.getDocumentOrFail(documentId);

    await this.permissionAccessService.validateToEditOrDelete(
      { entityId: document.id, entityType: PermissionEntityType.DOCUMENT },
      true,
    );

    const revision = await this.revisionsRepository.save({
      document: { id: document.id },
      number: data.number,
      author: { id: data.authorId },
      status: this.getDocumentRevisionStatusesService.getInitialStatus(document.status),
      approvingDeadline: data.approvingDeadline,
      canProlongApprovingDeadline: data.canProlongApprovingDeadline,
    });

    await this.createDocumentRevisionResponsibleUserService.createResponsibleUserIfNeedOrFail(
      revision.id,
      data.responsibleUserId ?? null,
      document.id,
    );

    await this.createDocumentRevisionResponsibleUserFlowService.createResponsibleUserFlowIfNeedOrFail(
      revision.id,
      data.responsibleUserFlowId ?? null,
      document.id,
    );

    await this.createDocumentRevisionsElasticService.elasticCreateRevisionIndexOrFail(revision.id);

    await this.editDocumentRevisionStatusesService.updateElasticDocumentLastRevisionStatus(
      document.id,
      revision.status,
    );

    this.eventEmitter.emit(DocumentRevisionCreated.eventName, new DocumentRevisionCreated(revision.id));

    return revision.id;
  }
}
