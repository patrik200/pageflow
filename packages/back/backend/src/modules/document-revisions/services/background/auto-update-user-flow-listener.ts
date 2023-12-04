import { Injectable, OnApplicationBootstrap } from "@nestjs/common";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { InjectRepository } from "@nestjs/typeorm";
import { IsNull, Repository } from "typeorm";

import { DocumentRevisionEntity } from "entities/Document/Document/Revision";

import { DocumentResponsibleUserUpdated } from "modules/documents/events/DocumentResponsibleUserUpdated";
import { DocumentResponsibleUserFlowUpdated } from "modules/documents/events/DocumentResponsibleUserFlowUpdated";

import { EditDocumentRevisionResponsibleUserService } from "../responsible-user/user/edit";
import { EditDocumentRevisionResponsibleUserFlowService } from "../responsible-user/userFlow/edit";

@Injectable()
export class DocumentRevisionAutoUpdateUserFlowListenerService implements OnApplicationBootstrap {
  constructor(
    private eventEmitter: EventEmitter2,
    @InjectRepository(DocumentRevisionEntity) private revisionsRepository: Repository<DocumentRevisionEntity>,
    private editDocumentRevisionResponsibleUserService: EditDocumentRevisionResponsibleUserService,
    private editDocumentRevisionResponsibleUserFlowService: EditDocumentRevisionResponsibleUserFlowService,
  ) {}

  private async updateResponsibleUser(event: DocumentResponsibleUserUpdated) {
    if (!event.responsibleUserId) return;
    const revisions = await this.revisionsRepository.find({
      where: { document: { id: event.documentId }, responsibleUserApproving: IsNull() },
      relations: { document: true, responsibleUserApproving: true },
    });

    for (const revision of revisions) {
      await this.editDocumentRevisionResponsibleUserService.unsafeUpdateResponsibleUserIfNeedOrFail(
        revision.id,
        event.responsibleUserId,
      );
    }
  }

  private async updateResponsibleUserFlow(event: DocumentResponsibleUserFlowUpdated) {
    if (!event.responsibleUserFlow) return;

    const revisions = await this.revisionsRepository.find({
      where: { document: { id: event.documentId }, responsibleUserFlowApproving: IsNull() },
      relations: { document: true, responsibleUserFlowApproving: true },
    });

    for (const revision of revisions) {
      await this.editDocumentRevisionResponsibleUserFlowService.unsafeUpdateResponsibleUserFlowIfNeedOrFail(
        revision.id,
        event.responsibleUserFlow.id,
      );
    }
  }

  onApplicationBootstrap() {
    this.eventEmitter.addListener(DocumentResponsibleUserUpdated.eventName, (event) =>
      this.updateResponsibleUser(event),
    );
    this.eventEmitter.addListener(DocumentResponsibleUserFlowUpdated.eventName, (event) =>
      this.updateResponsibleUserFlow(event),
    );
  }
}
