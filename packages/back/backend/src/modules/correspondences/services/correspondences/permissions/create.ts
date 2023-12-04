import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { PermissionEntityType } from "@app/shared-enums";
import { EventEmitter2 } from "@nestjs/event-emitter";

import { CreatePermissionInterface, CreatePermissionService } from "modules/permissions";

import { GetCorrespondenceService } from "../get";
import { CorrespondenceUpdated } from "../../../events/CorrespondenceUpdated";

@Injectable()
export class CreateCorrespondencePermissionsService {
  constructor(
    private getCorrespondenceService: GetCorrespondenceService,
    @Inject(forwardRef(() => CreatePermissionService)) private createPermissionService: CreatePermissionService,
    private eventEmitter: EventEmitter2,
  ) {}

  async createCorrespondencePermission(correspondenceId: string, data: CreatePermissionInterface) {
    const correspondence = await this.getCorrespondenceService.getCorrespondenceOrFail(correspondenceId, {
      loadPermissions: true,
      permissionSelectOptions: { loadUser: true },
    });

    await this.createPermissionService.createPermissionOrFail(
      { entityId: correspondence.id, entityType: PermissionEntityType.CORRESPONDENCE },
      data,
      { validateCurrentUserPermissions: true },
    );

    this.eventEmitter.emit(
      CorrespondenceUpdated.eventName,
      new CorrespondenceUpdated(correspondence.id, correspondence),
    );
  }
}
