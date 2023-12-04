import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { PermissionEntityType } from "@app/shared-enums";
import { EventEmitter2 } from "@nestjs/event-emitter";

import { DeletePermissionService } from "modules/permissions";

import { GetCorrespondenceService } from "../get";
import { CorrespondenceUpdated } from "../../../events/CorrespondenceUpdated";

@Injectable()
export class DeleteCorrespondencePermissionsService {
  constructor(
    private getCorrespondenceService: GetCorrespondenceService,
    @Inject(forwardRef(() => DeletePermissionService)) private deletePermissionService: DeletePermissionService,
    private eventEmitter: EventEmitter2,
  ) {}

  async deleteCorrespondencePermission(correspondenceId: string, data: { userId: string }) {
    const correspondence = await this.getCorrespondenceService.getCorrespondenceOrFail(correspondenceId, {
      loadPermissions: true,
      permissionSelectOptions: { loadUser: true },
    });

    await this.deletePermissionService.deletePermissionOrFail({
      entityId: correspondence.id,
      entityType: PermissionEntityType.CORRESPONDENCE,
      userId: data.userId,
    });

    this.eventEmitter.emit(
      CorrespondenceUpdated.eventName,
      new CorrespondenceUpdated(correspondence.id, correspondence),
    );
  }
}
