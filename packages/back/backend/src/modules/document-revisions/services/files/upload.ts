import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { ExpressMultipartFile, FileExtensionsService, ServiceError } from "@app/back-kit";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Transactional } from "typeorm-transactional";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { PermissionEntityType } from "@app/shared-enums";

import { DocumentRevisionEntity } from "entities/Document/Document/Revision";
import { DocumentRevisionFileEntity } from "entities/Document/Document/Revision/File";
import { DocumentRevisionResponsibleUserFlowRowUserFileEntity } from "entities/Document/Document/Revision/Approving/UserFlowApproving/Row/User/File";
import { DocumentRevisionResponsibleUserFlowRowUserEntity } from "entities/Document/Document/Revision/Approving/UserFlowApproving/Row/User";

import { getCurrentUser } from "modules/auth";
import { UploadFileService } from "modules/storage";
import { PermissionAccessService } from "modules/permissions";

import { CreateDocumentRevisionFilesElasticService } from "./create-elastic";
import { GetDocumentRevisionService } from "../revisions/get";
import { DocumentRevisionUpdated } from "../../events/RevisionUpdated";

@Injectable()
export class UploadDocumentRevisionFilesService {
  constructor(
    @InjectRepository(DocumentRevisionEntity)
    private revisionsRepository: Repository<DocumentRevisionEntity>,
    @InjectRepository(DocumentRevisionFileEntity)
    private revisionFilesRepository: Repository<DocumentRevisionFileEntity>,
    @InjectRepository(DocumentRevisionResponsibleUserFlowRowUserFileEntity)
    private userFlowRowUserFilesRepository: Repository<DocumentRevisionResponsibleUserFlowRowUserFileEntity>,
    @InjectRepository(DocumentRevisionResponsibleUserFlowRowUserEntity)
    private userFlowRowUserRepository: Repository<DocumentRevisionResponsibleUserFlowRowUserEntity>,
    private uploadFileService: UploadFileService,
    private fileExtensionsService: FileExtensionsService,
    private eventEmitter: EventEmitter2,
    private createDocumentRevisionFilesElasticService: CreateDocumentRevisionFilesElasticService,
    private getDocumentRevisionService: GetDocumentRevisionService,
    @Inject(forwardRef(() => PermissionAccessService)) private permissionAccessService: PermissionAccessService,
  ) {}

  @Transactional()
  async uploadFileOrFail(revisionId: string, file: ExpressMultipartFile) {
    const currentUser = getCurrentUser();
    const revision = await this.getDocumentRevisionService.getRevisionOrFail(revisionId, { loadFiles: true });

    await this.permissionAccessService.validateToEditOrDelete(
      { entityId: revision.document.id, entityType: PermissionEntityType.DOCUMENT },
      true,
    );

    await this.revisionsRepository.update(revision.id, {});

    const uploadedFile = await this.uploadFileService.uploadFileOrFail(
      `client.${currentUser.clientId}.documents`,
      file,
    );

    const addToElastic = this.fileExtensionsService.compareDocumentExtensionPresetAndExtension(
      ["excel", "word", "pdf"],
      this.fileExtensionsService.getExtension(uploadedFile.id),
    );

    if (addToElastic)
      await this.createDocumentRevisionFilesElasticService.elasticAddRevisionAttachment(
        revision.id,
        { entity: { id: uploadedFile.id, fileName: uploadedFile.fileName }, buffer: uploadedFile.buffer },
        { waitForIndex: false },
      );

    const revisionFile = await this.revisionFilesRepository.save({
      file: { id: uploadedFile.id },
      revision: { id: revision.id },
      hasElasticAttachment: addToElastic,
    });

    this.eventEmitter.emit(DocumentRevisionUpdated.eventName, new DocumentRevisionUpdated(revision.id, revision));

    return { id: revisionFile, file: uploadedFile };
  }

  @Transactional()
  async uploadResponsibleUserFlowRowUserAttachmentOrFail(rowUserId: string, file: ExpressMultipartFile) {
    const rowUser = await this.userFlowRowUserRepository.findOneOrFail({
      where: { id: rowUserId },
      relations: { user: { client: true } },
    });

    const { clientId } = getCurrentUser();
    if (rowUser.user.client.id !== clientId)
      throw new ServiceError("user", "У вас нет прав добавлять вложения к этому шагу", 403);
    if (rowUser.approved) throw new ServiceError("attachment", "Невозможно загрузить вложение. Шаг уже принят", 400);

    const uploadedFile = await this.uploadFileService.uploadFileOrFail(`client.${clientId}.documents`, file);

    const savedRevisionFile = await this.userFlowRowUserFilesRepository.save({
      file: { id: uploadedFile.id },
      rowUser: rowUser,
    });

    return { id: savedRevisionFile, file: uploadedFile };
  }
}
