import { ExpressMultipartFile, FileExtensionsService } from "@app/back-kit";
import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Transactional } from "typeorm-transactional";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { PermissionEntityType } from "@app/shared-enums";

import { CorrespondenceRevisionFileEntity } from "entities/Correspondence/Correspondence/Revision/File";
import { CorrespondenceRevisionEntity } from "entities/Correspondence/Correspondence/Revision";

import { getCurrentUser } from "modules/auth";
import { UploadFileService } from "modules/storage";
import { PermissionAccessService } from "modules/permissions";

import { GetCorrespondenceRevisionService } from "../revisions/get";
import { CreateCorrespondenceRevisionFilesElasticService } from "./create-elastic";
import { CorrespondenceRevisionUpdated } from "../../events/RevisionUpdated";

@Injectable()
export class UploadCorrespondenceRevisionFilesService {
  constructor(
    @InjectRepository(CorrespondenceRevisionEntity)
    private revisionRepository: Repository<CorrespondenceRevisionEntity>,
    @InjectRepository(CorrespondenceRevisionFileEntity)
    private revisionFileRepository: Repository<CorrespondenceRevisionFileEntity>,
    private getCorrespondenceRevisionService: GetCorrespondenceRevisionService,
    private uploadFileService: UploadFileService,
    private fileExtensionsService: FileExtensionsService,
    private createRevisionFilesElasticService: CreateCorrespondenceRevisionFilesElasticService,
    private eventEmitter: EventEmitter2,
    @Inject(forwardRef(() => PermissionAccessService)) private permissionAccessService: PermissionAccessService,
  ) {}

  @Transactional()
  async uploadFileOrFail(revisionId: string, file: ExpressMultipartFile) {
    const currentUser = getCurrentUser();
    const revision = await this.getCorrespondenceRevisionService.getRevisionOrFail(revisionId, { loadFiles: true });

    await this.permissionAccessService.validateToEditOrDelete(
      { entityId: revision.correspondence.id, entityType: PermissionEntityType.CORRESPONDENCE },
      true,
    );

    await this.revisionRepository.update(revision.id, {});

    const uploadedFile = await this.uploadFileService.uploadFileOrFail(
      `client.${currentUser.clientId}.correspondences`,
      file,
    );

    const addToElastic = this.fileExtensionsService.compareDocumentExtensionPresetAndExtension(
      ["excel", "word", "pdf"],
      this.fileExtensionsService.getExtension(uploadedFile.id),
    );

    if (addToElastic)
      await this.createRevisionFilesElasticService.elasticAddRevisionAttachment(
        revision.id,
        { entity: { id: uploadedFile.id, fileName: uploadedFile.fileName }, buffer: uploadedFile.buffer },
        { waitForIndex: false },
      );

    const revisionFile = await this.revisionFileRepository.save({
      file: { id: uploadedFile.id },
      revision: { id: revision.id },
      hasElasticAttachment: addToElastic,
    });

    this.eventEmitter.emit(
      CorrespondenceRevisionUpdated.eventName,
      new CorrespondenceRevisionUpdated(revision.id, revision),
    );

    return { id: revisionFile.id, file: uploadedFile };
  }
}
