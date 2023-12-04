import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { PermissionEntityType } from "@app/shared-enums";
import { EventEmitter2 } from "@nestjs/event-emitter";

import { EditPermissionInterface, EditPermissionService } from "modules/permissions";

import { GetCorrespondenceService } from "../get";
import { CorrespondenceUpdated } from "../../../events/CorrespondenceUpdated";

@Injectable()
export class EditCorrespondencePermissionsService {
  constructor(
    private getCorrespondenceService: GetCorrespondenceService,
    @Inject(forwardRef(() => EditPermissionService)) private editPermissionService: EditPermissionService,
    private eventEmitter: EventEmitter2,
  ) {}

  async editCorrespondencePermission(correspondenceId: string, data: EditPermissionInterface & { userId: string }) {
    const correspondence = await this.getCorrespondenceService.getCorrespondenceOrFail(correspondenceId, {
      loadPermissions: true,
      permissionSelectOptions: { loadUser: true },
    });

    await this.editPermissionService.editPermissionOrFail(
      { entityId: correspondence.id, entityType: PermissionEntityType.CORRESPONDENCE, userId: data.userId },
      data,
    );

    this.eventEmitter.emit(
      CorrespondenceUpdated.eventName,
      new CorrespondenceUpdated(correspondence.id, correspondence),
    );
  }
}
