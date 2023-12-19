import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Transactional } from "typeorm-transactional";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { PermissionEntityType } from "@app/shared-enums";

import { CorrespondenceEntity } from "entities/Correspondence/Correspondence";

import { DeleteCorrespondenceRevisionsService } from "modules/correspondence-revisions";
import { DeletePermissionService, PermissionAccessService } from "modules/permissions";

import { RemoveCorrespondenceFavouritesService } from "./favourites";
import { DeleteCorrespondenceElasticService } from "./elastic";
import { GetCorrespondenceService } from "./get";
import { CorrespondenceDeleted } from "../../events/CorrespondenceDeleted";

@Injectable()
export class DeleteCorrespondenceService {
  constructor(
    @InjectRepository(CorrespondenceEntity) private correspondenceRepository: Repository<CorrespondenceEntity>,
    @Inject(forwardRef(() => DeleteCorrespondenceRevisionsService))
    private deleteCorrespondenceRevisionsService: DeleteCorrespondenceRevisionsService,
    private getCorrespondenceService: GetCorrespondenceService,
    private removeCorrespondenceFavouritesService: RemoveCorrespondenceFavouritesService,
    private deleteCorrespondenceElasticService: DeleteCorrespondenceElasticService,
    @Inject(forwardRef(() => PermissionAccessService)) private permissionAccessService: PermissionAccessService,
    @Inject(forwardRef(() => DeletePermissionService)) private deletePermissionService: DeletePermissionService,
    private eventEmitter: EventEmitter2,
  ) {}

  @Transactional()
  async deleteCorrespondenceOrFail(
    correspondenceId: string,
    { checkPermissions = true, emitEvents = true }: { checkPermissions?: boolean; emitEvents?: boolean } = {},
  ) {
    if (checkPermissions) {
      await this.permissionAccessService.validateToEditOrDelete(
        { entityId: correspondenceId, entityType: PermissionEntityType.CORRESPONDENCE },
        true,
      );
    }

    const correspondence = await this.getCorrespondenceService.getCorrespondenceOrFail(correspondenceId, {
      checkPermissions,
      loadRevisions: true,
    });

    await Promise.all([
      ...correspondence.revisions.map((revision) =>
        this.deleteCorrespondenceRevisionsService.deleteRevisionOrFail(revision.id, {
          checkPermissions: false,
          emitEvents: false,
        }),
      ),
      this.removeCorrespondenceFavouritesService.removeCorrespondenceFavouriteOrFail(correspondence.id, {
        forAllUsers: true,
      }),
    ]);

    await Promise.all([
      this.correspondenceRepository.delete(correspondence.id),
      this.deletePermissionService.deleteAllPermissionsOrFail({
        entityId: correspondence.id,
        entityType: PermissionEntityType.CORRESPONDENCE,
      }),
      this.deleteCorrespondenceElasticService.elasticDeleteCorrespondenceIndexOrFail(correspondence.id),
    ]);

    if (emitEvents)
      this.eventEmitter.emit(CorrespondenceDeleted.eventName, new CorrespondenceDeleted(correspondence.id));
  }
}
