import { ServiceError } from "@app/back-kit";
import { DocumentStatus, PermissionEntityType } from "@app/shared-enums";
import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Transactional } from "typeorm-transactional";

import { DocumentEntity } from "entities/Document/Document";

import { PermissionAccessService } from "modules/permissions";

import { DocumentRevisionActiveAutomaticallyService } from "../revisions/active-automatically";
import { EditDocumentsElasticService } from "./elastic";
import { GetDocumentService } from "./get";
import { DocumentUpdated } from "../../events/DocumentUpdated";

@Injectable()
export class ActiveDocumentService {
  constructor(
    @InjectRepository(DocumentEntity) private documentRepository: Repository<DocumentEntity>,
    private getDocumentService: GetDocumentService,
    private documentRevisionActiveAutomaticallyService: DocumentRevisionActiveAutomaticallyService,
    private editDocumentsElasticService: EditDocumentsElasticService,
    private eventEmitter: EventEmitter2,
    @Inject(forwardRef(() => PermissionAccessService)) private permissionAccessService: PermissionAccessService,
  ) {}

  @Transactional()
  async activeDocumentOrFail(documentId: string) {
    const document = await this.getDocumentService.getDocumentOrFail(documentId, {
      loadRevisions: true,
      loadResponsibleUser: true,
    });

    if (!document.canActive) throw new ServiceError("status", "Вы не можете разархивировать этот документ");

    await this.permissionAccessService.validateToEditOrDelete(
      { entityId: document.id, entityType: PermissionEntityType.DOCUMENT },
      true,
    );

    await Promise.all([
      this.documentRepository.update(document.id, { status: DocumentStatus.ACTIVE }),
      this.editDocumentsElasticService.elasticUpdateDocumentStatusIndexOrFail(document.id, DocumentStatus.ACTIVE),
      ...document.revisions.map(({ id }) =>
        this.documentRevisionActiveAutomaticallyService.unsafeRevisionActiveAutomaticallyOrFail(id),
      ),
    ]);

    this.eventEmitter.emit(DocumentUpdated.eventName, new DocumentUpdated(document.id, document));
  }
}
