import { CorrespondenceRevisionStatus, CorrespondenceStatus, PermissionEntityType } from "@app/shared-enums";
import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Transactional } from "typeorm-transactional";
import { EventEmitter2 } from "@nestjs/event-emitter";

import { CorrespondenceRevisionEntity } from "entities/Correspondence/Correspondence/Revision";

import { getCurrentUser } from "modules/auth";
import { GetCorrespondenceService } from "modules/correspondences";
import { PermissionAccessService } from "modules/permissions";

import { CreateCorrespondenceRevisionsElasticService } from "./create-elastic";
import { CorrespondenceRevisionCreated } from "../../events/RevisionCreated";

interface CreateRevisionData {
  number: string;
}

@Injectable()
export class CreateCorrespondenceRevisionsService {
  constructor(
    @InjectRepository(CorrespondenceRevisionEntity)
    private revisionRepository: Repository<CorrespondenceRevisionEntity>,
    @Inject(forwardRef(() => GetCorrespondenceService)) private getCorrespondenceService: GetCorrespondenceService,
    private createRevisionsElasticService: CreateCorrespondenceRevisionsElasticService,
    private eventEmitter: EventEmitter2,
    @Inject(forwardRef(() => PermissionAccessService)) private permissionAccessService: PermissionAccessService,
  ) {}

  @Transactional()
  async createRevisionOrFail(correspondenceId: string, data: CreateRevisionData) {
    const correspondence = await this.getCorrespondenceService.getCorrespondenceOrFail(correspondenceId);

    await this.permissionAccessService.validateToEditOrDelete(
      { entityId: correspondence.id, entityType: PermissionEntityType.CORRESPONDENCE },
      true,
    );

    const revision = await this.revisionRepository.save({
      correspondence: { id: correspondence.id },
      author: { id: getCurrentUser().userId },
      number: data.number,
      status:
        correspondence.status === CorrespondenceStatus.ACTIVE
          ? CorrespondenceRevisionStatus.ACTIVE
          : CorrespondenceRevisionStatus.ARCHIVED_AUTOMATICALLY_RESTORE_ACTIVE,
    });

    await this.createRevisionsElasticService.elasticCreateCorrespondenceRevisionIndexOrFail(revision.id);

    this.eventEmitter.emit(CorrespondenceRevisionCreated.eventName, new CorrespondenceRevisionCreated(revision.id));

    return revision.id;
  }
}
