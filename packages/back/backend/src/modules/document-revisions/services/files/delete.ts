import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { ElasticService } from "@app/back-kit";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Transactional } from "typeorm-transactional";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { PermissionEntityType } from "@app/shared-enums";

import { DocumentRevisionEntity } from "entities/Document/Document/Revision";
import { DocumentRevisionFileEntity } from "entities/Document/Document/Revision/File";

import { DeleteFileService } from "modules/storage";
import { PermissionAccessService } from "modules/permissions";

import { GetDocumentRevisionService } from "../revisions/get";
import { DocumentRevisionUpdated } from "../../events/RevisionUpdated";

@Injectable()
export class DeleteDocumentRevisionFilesService {
  constructor(
    @InjectRepository(DocumentRevisionEntity)
    private revisionsRepository: Repository<DocumentRevisionEntity>,
    @InjectRepository(DocumentRevisionFileEntity)
    private revisionFilesRepository: Repository<DocumentRevisionFileEntity>,
    private deleteFileService: DeleteFileService,
    private elasticService: ElasticService,
    private eventEmitter: EventEmitter2,
    private getDocumentRevisionService: GetDocumentRevisionService,
    @Inject(forwardRef(() => PermissionAccessService)) private permissionAccessService: PermissionAccessService,
  ) {}

  @Transactional()
  async deleteFileOrFail(
    revisionId: string,
    fileId: string,
    { checkPermissions = true, emitEvent = true }: { checkPermissions?: boolean; emitEvent?: boolean } = {},
  ) {
    const revision = await this.getDocumentRevisionService.getRevisionOrFail(revisionId, {
      checkPermissions,
      loadFiles: true,
    });

    const revisionFile = await this.revisionFilesRepository.findOneOrFail({
      where: { file: { id: fileId }, revision: { id: revision.id } },
      relations: { revision: true, file: true },
    });

    if (checkPermissions)
      await this.permissionAccessService.validateToEditOrDelete(
        { entityId: revision.document.id, entityType: PermissionEntityType.DOCUMENT },
        true,
      );

    await this.revisionsRepository.update(revisionFile.revision.id, {});

    if (revisionFile.hasElasticAttachment)
      await this.elasticService.deleteDocumentAttachmentOrFail(
        this.elasticService.getDocumentId("document-revisions", revisionFile.revision.id),
        "attachments",
        revisionFile.file.id,
      );

    await this.revisionFilesRepository.delete(revisionFile.id);
    await this.deleteFileService.deleteFileOrFail(revisionFile.file);

    if (emitEvent) {
      this.eventEmitter.emit(DocumentRevisionUpdated.eventName, new DocumentRevisionUpdated(revision.id, revision));
    }
  }
}
