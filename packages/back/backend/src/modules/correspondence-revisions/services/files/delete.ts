import { ElasticService } from "@app/back-kit";
import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Transactional } from "typeorm-transactional";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { PermissionEntityType } from "@app/shared-enums";

import { CorrespondenceRevisionFileEntity } from "entities/Correspondence/Correspondence/Revision/File";
import { CorrespondenceRevisionEntity } from "entities/Correspondence/Correspondence/Revision";

import { DeleteFileService } from "modules/storage";
import { PermissionAccessService } from "modules/permissions";

import { GetCorrespondenceRevisionService } from "../revisions/get";
import { CorrespondenceRevisionUpdated } from "../../events/RevisionUpdated";

@Injectable()
export class DeleteCorrespondenceRevisionFilesService {
  constructor(
    @InjectRepository(CorrespondenceRevisionEntity)
    private revisionRepository: Repository<CorrespondenceRevisionEntity>,
    @InjectRepository(CorrespondenceRevisionFileEntity)
    private revisionFileRepository: Repository<CorrespondenceRevisionFileEntity>,
    private deleteFileService: DeleteFileService,
    private elasticService: ElasticService,
    private eventEmitter: EventEmitter2,
    @Inject(forwardRef(() => PermissionAccessService)) private permissionAccessService: PermissionAccessService,
    private getCorrespondenceRevisionService: GetCorrespondenceRevisionService,
  ) {}

  @Transactional()
  async deleteFileOrFail(
    revisionId: string,
    fileId: string,
    { checkPermissions = true, emitEvents = true }: { checkPermissions?: boolean; emitEvents?: boolean } = {},
  ) {
    const revision = await this.getCorrespondenceRevisionService.getRevisionOrFail(revisionId, {
      checkPermissions,
      loadFiles: true,
    });

    const revisionFile = await this.revisionFileRepository.findOneOrFail({
      where: { file: { id: fileId }, revision: { id: revision.id } },
      relations: {
        file: true,
        revision: {
          correspondence: true,
        },
      },
    });

    if (checkPermissions)
      await this.permissionAccessService.validateToEditOrDelete(
        { entityId: revisionFile.revision.correspondence.id, entityType: PermissionEntityType.CORRESPONDENCE },
        true,
      );

    await this.revisionRepository.update(revisionFile.revision.id, {});

    if (revisionFile.hasElasticAttachment)
      await this.elasticService.deleteDocumentAttachmentOrFail(
        this.elasticService.getDocumentId("correspondence-revisions", revisionFile.revision.id),
        "attachments",
        revisionFile.file.id,
      );

    await this.revisionFileRepository.delete(revisionFile.id);
    await this.deleteFileService.deleteFileOrFail(revisionFile.file);

    if (emitEvents) {
      this.eventEmitter.emit(
        CorrespondenceRevisionUpdated.eventName,
        new CorrespondenceRevisionUpdated(revisionId, revision),
      );
    }
  }
}
