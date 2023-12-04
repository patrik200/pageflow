import { CorrespondenceStatus, PermissionEntityType } from "@app/shared-enums";
import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Transactional } from "typeorm-transactional";
import { EventEmitter2 } from "@nestjs/event-emitter";

import { CorrespondenceEntity } from "entities/Correspondence/Correspondence";

import { ArchiveCorrespondenceRevisionsService } from "modules/correspondence-revisions";
import { PermissionAccessService } from "modules/permissions";

import { EditCorrespondenceElasticService } from "./elastic";
import { GetCorrespondenceService } from "./get";
import { CorrespondenceUpdated } from "../../events/CorrespondenceUpdated";

@Injectable()
export class ArchiveCorrespondencesService {
  constructor(
    @InjectRepository(CorrespondenceEntity)
    private correspondenceRepository: Repository<CorrespondenceEntity>,
    @Inject(forwardRef(() => ArchiveCorrespondenceRevisionsService))
    private archiveCorrespondenceRevisionsService: ArchiveCorrespondenceRevisionsService,
    private getCorrespondenceService: GetCorrespondenceService,
    private editCorrespondenceElasticService: EditCorrespondenceElasticService,
    @Inject(forwardRef(() => PermissionAccessService)) private permissionAccessService: PermissionAccessService,
    private eventEmitter: EventEmitter2,
  ) {}

  @Transactional()
  async archiveCorrespondenceOrFail(correspondenceId: string) {
    const correspondence = await this.getCorrespondenceService.getCorrespondenceOrFail(correspondenceId, {
      loadRevisions: true,
    });

    await this.permissionAccessService.validateToEditOrDelete(
      { entityId: correspondence.id, entityType: PermissionEntityType.CORRESPONDENCE },
      true,
    );

    const updateOptions = {
      status: CorrespondenceStatus.ARCHIVE,
    };

    await Promise.all([
      this.correspondenceRepository.update(correspondence.id, updateOptions),
      this.editCorrespondenceElasticService.elasticUpdateCorrespondenceIndexOrFail(correspondence.id, updateOptions),
      ...correspondence.revisions.map(({ id }) =>
        this.archiveCorrespondenceRevisionsService.archiveAutomaticallyRevisionOrFail(id),
      ),
    ]);

    this.eventEmitter.emit(
      CorrespondenceUpdated.eventName,
      new CorrespondenceUpdated(correspondence.id, correspondence),
    );
  }
}
