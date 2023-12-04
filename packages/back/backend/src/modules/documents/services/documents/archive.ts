import { ServiceError } from "@app/back-kit";
import { DocumentStatus, PermissionEntityType } from "@app/shared-enums";
import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Transactional } from "typeorm-transactional";

import { DocumentEntity } from "entities/Document/Document";

import { PermissionAccessService } from "modules/permissions";

import { DocumentRevisionArchiveAutomaticallyService } from "../revisions/archive-automatically";
import { EditDocumentsElasticService } from "./elastic";
import { GetDocumentService } from "./get";
import { DocumentUpdated } from "../../events/DocumentUpdated";

@Injectable()
export class ArchiveDocumentService {
  constructor(
    @InjectRepository(DocumentEntity) private documentRepository: Repository<DocumentEntity>,
    private getDocumentService: GetDocumentService,
    private documentRevisionArchiveAutomaticallyService: DocumentRevisionArchiveAutomaticallyService,
    private editDocumentsElasticService: EditDocumentsElasticService,
    private eventEmitter: EventEmitter2,
    @Inject(forwardRef(() => PermissionAccessService)) private permissionAccessService: PermissionAccessService,
  ) {}

  @Transactional()
  async archiveDocumentOrFail(documentId: string) {
    const document = await this.getDocumentService.getDocumentOrFail(documentId, {
      loadRevisions: true,
      loadResponsibleUser: true,
    });

    if (!document.canArchive) throw new ServiceError("status", "Вы не можете архивировать этот документ");

    await this.permissionAccessService.validateToEditOrDelete(
      { entityId: document.id, entityType: PermissionEntityType.DOCUMENT },
      true,
    );

    await Promise.all([
      this.documentRepository.update(document.id, {
        status: DocumentStatus.ARCHIVE,
      }),
      this.editDocumentsElasticService.elasticUpdateDocumentStatusIndexOrFail(document.id, DocumentStatus.ARCHIVE),
      ...document.revisions.map(({ id }) =>
        this.documentRevisionArchiveAutomaticallyService.unsafeRevisionArchiveAutomaticallyOrFail(id),
      ),
    ]);

    this.eventEmitter.emit(DocumentUpdated.eventName, new DocumentUpdated(document.id, document));
  }
}
