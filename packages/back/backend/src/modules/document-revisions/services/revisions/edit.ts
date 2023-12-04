import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Transactional } from "typeorm-transactional";
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { PermissionEntityType } from "@app/shared-enums";

import { DocumentRevisionEntity } from "entities/Document/Document/Revision";

import { PermissionAccessService } from "modules/permissions";

import { EditDocumentRevisionResponsibleUserService } from "../responsible-user/user/edit";
import { EditDocumentRevisionResponsibleUserFlowService } from "../responsible-user/userFlow/edit";
import { GetDocumentRevisionService } from "./get";
import { DocumentRevisionUpdated } from "../../events/RevisionUpdated";

interface UpdateRevisionData {
  number?: string;
  responsibleUserId?: string | null;
  responsibleUserFlowId?: string | null;
  approvingDeadline?: Date | null;
  canProlongApprovingDeadline?: boolean;
}

@Injectable()
export class EditDocumentRevisionsService {
  constructor(
    @InjectRepository(DocumentRevisionEntity) private revisionsRepository: Repository<DocumentRevisionEntity>,
    private editDocumentRevisionResponsibleUserService: EditDocumentRevisionResponsibleUserService,
    private editDocumentRevisionResponsibleUserFlowService: EditDocumentRevisionResponsibleUserFlowService,
    private eventEmitter: EventEmitter2,
    private getDocumentRevisionService: GetDocumentRevisionService,
    @Inject(forwardRef(() => PermissionAccessService)) private permissionAccessService: PermissionAccessService,
  ) {}

  @Transactional()
  async updateRevisionOrFail(revisionId: string, data: UpdateRevisionData) {
    const revision = await this.getDocumentRevisionService.getRevisionOrFail(revisionId);

    await this.permissionAccessService.validateToEditOrDelete(
      { entityId: revision.document.id, entityType: PermissionEntityType.DOCUMENT },
      true,
    );

    const updateOptions: QueryDeepPartialEntity<DocumentRevisionEntity> = {};
    if (data.number) updateOptions.number = data.number;
    if (data.approvingDeadline !== undefined) updateOptions.approvingDeadline = data.approvingDeadline;
    if (data.canProlongApprovingDeadline !== undefined)
      updateOptions.canProlongApprovingDeadline = data.canProlongApprovingDeadline;

    await this.revisionsRepository.update(revision.id, updateOptions);

    if (data.responsibleUserId !== undefined)
      await this.editDocumentRevisionResponsibleUserService.unsafeUpdateResponsibleUserIfNeedOrFail(
        revision.id,
        data.responsibleUserId,
      );

    if (data.responsibleUserFlowId !== undefined)
      await this.editDocumentRevisionResponsibleUserFlowService.unsafeUpdateResponsibleUserFlowIfNeedOrFail(
        revision.id,
        data.responsibleUserFlowId,
      );

    this.eventEmitter.emit(DocumentRevisionUpdated.eventName, new DocumentRevisionUpdated(revision.id, revision));
  }
}
