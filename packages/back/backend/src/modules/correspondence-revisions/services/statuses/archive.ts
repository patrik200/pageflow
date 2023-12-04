import { ElasticDocumentData, ElasticService, ServiceError, TypeormUpdateEntity } from "@app/back-kit";
import { CorrespondenceRevisionStatus, PermissionEntityType } from "@app/shared-enums";
import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Transactional } from "typeorm-transactional";
import { EventEmitter2 } from "@nestjs/event-emitter";

import { CorrespondenceRevisionEntity } from "entities/Correspondence/Correspondence/Revision";

import { PermissionAccessService } from "modules/permissions";

import { GetCorrespondenceRevisionService } from "../revisions/get";
import { CorrespondenceRevisionUpdated } from "../../events/RevisionUpdated";

@Injectable()
export class ArchiveCorrespondenceRevisionsService {
  constructor(
    @InjectRepository(CorrespondenceRevisionEntity)
    private revisionRepository: Repository<CorrespondenceRevisionEntity>,
    private getCorrespondenceRevisionService: GetCorrespondenceRevisionService,
    private elasticService: ElasticService,
    private eventEmitter: EventEmitter2,
    @Inject(forwardRef(() => PermissionAccessService)) private permissionAccessService: PermissionAccessService,
  ) {}

  @Transactional()
  async archiveRevisionOrFail(revisionId: string) {
    const revision = await this.getCorrespondenceRevisionService.getRevisionOrFail(revisionId);

    await this.permissionAccessService.validateToEditOrDelete(
      { entityId: revision.correspondence.id, entityType: PermissionEntityType.CORRESPONDENCE },
      true,
    );

    if (!revision.canArchiveByStatus) throw new ServiceError("status", "Невозможно архивировать ревизию");

    const updateOptions: TypeormUpdateEntity<CorrespondenceRevisionEntity> = {
      status: CorrespondenceRevisionStatus.ARCHIVE,
    };

    await Promise.all([
      this.revisionRepository.update(revision.id, Object.assign({}, updateOptions)),
      this.elasticService.updateDocumentOrFail(
        this.elasticService.getDocumentId("correspondence-revisions", revision.id),
        Object.assign({}, updateOptions) as ElasticDocumentData,
      ),
    ]);

    this.eventEmitter.emit(
      CorrespondenceRevisionUpdated.eventName,
      new CorrespondenceRevisionUpdated(revision.id, revision),
    );
  }

  @Transactional()
  async archiveAutomaticallyRevisionOrFail(revisionId: string) {
    const revision = await this.getCorrespondenceRevisionService.getRevisionOrFail(revisionId, {
      checkPermissions: false,
    });
    if (revision.isArchivedAutomatically()) return;

    const updateOptions: TypeormUpdateEntity<CorrespondenceRevisionEntity> = {
      status:
        revision.status === CorrespondenceRevisionStatus.ARCHIVE
          ? CorrespondenceRevisionStatus.ARCHIVED_AUTOMATICALLY_RESTORE_ARCHIVE
          : CorrespondenceRevisionStatus.ARCHIVED_AUTOMATICALLY_RESTORE_ACTIVE,
    };

    await Promise.all([
      this.revisionRepository.update(revision.id, Object.assign({}, updateOptions)),
      this.elasticService.updateDocumentOrFail(
        this.elasticService.getDocumentId("correspondence-revisions", revision.id),
        Object.assign({}, updateOptions) as ElasticDocumentData,
      ),
    ]);
  }
}
