import { ElasticDocumentData, ElasticService, TypeormUpdateEntity } from "@app/back-kit";
import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Transactional } from "typeorm-transactional";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { PermissionEntityType } from "@app/shared-enums";

import { CorrespondenceRevisionEntity } from "entities/Correspondence/Correspondence/Revision";

import { PermissionAccessService } from "modules/permissions";

import { GetCorrespondenceRevisionService } from "./get";
import { CorrespondenceRevisionUpdated } from "../../events/RevisionUpdated";

interface UpdateRevisionData {
  number?: string;
}

@Injectable()
export class EditCorrespondenceRevisionsService {
  constructor(
    @InjectRepository(CorrespondenceRevisionEntity)
    private revisionRepository: Repository<CorrespondenceRevisionEntity>,
    private getCorrespondenceRevisionService: GetCorrespondenceRevisionService,
    private elasticService: ElasticService,
    private eventEmitter: EventEmitter2,
    @Inject(forwardRef(() => PermissionAccessService)) private permissionAccessService: PermissionAccessService,
  ) {}

  @Transactional()
  async updateRevisionOrFail(revisionId: string, data: UpdateRevisionData) {
    const revision = await this.getCorrespondenceRevisionService.getRevisionOrFail(revisionId);

    await this.permissionAccessService.validateToEditOrDelete(
      { entityId: revision.correspondence.id, entityType: PermissionEntityType.CORRESPONDENCE },
      true,
    );

    const updateOptions: TypeormUpdateEntity<CorrespondenceRevisionEntity> = {};
    if (data.number) updateOptions.number = data.number;

    await this.revisionRepository.update(revision.id, Object.assign({}, updateOptions));

    await this.elasticService.updateDocumentOrFail(
      this.elasticService.getDocumentId("correspondence-revisions", revisionId),
      Object.assign({}, updateOptions) as ElasticDocumentData,
    );

    this.eventEmitter.emit(
      CorrespondenceRevisionUpdated.eventName,
      new CorrespondenceRevisionUpdated(revision.id, revision),
    );
  }
}
