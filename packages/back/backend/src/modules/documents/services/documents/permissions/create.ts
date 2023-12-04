import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { PermissionEntityType } from "@app/shared-enums";
import { EventEmitter2 } from "@nestjs/event-emitter";

import { CreatePermissionInterface, CreatePermissionService } from "modules/permissions";

import { GetDocumentService } from "../get";
import { DocumentUpdated } from "../../../events/DocumentUpdated";

@Injectable()
export class CreateDocumentPermissionsService {
  constructor(
    private getDocumentService: GetDocumentService,
    @Inject(forwardRef(() => CreatePermissionService)) private createPermissionService: CreatePermissionService,
    private eventEmitter: EventEmitter2,
  ) {}

  async createDocumentPermission(documentId: string, data: CreatePermissionInterface) {
    const document = await this.getDocumentService.getDocumentOrFail(documentId, {
      loadPermissions: true,
      permissionSelectOptions: { loadUser: true },
    });

    await this.createPermissionService.createPermissionOrFail(
      { entityId: documentId, entityType: PermissionEntityType.DOCUMENT },
      data,
      { validateCurrentUserPermissions: true },
    );

    this.eventEmitter.emit(DocumentUpdated.eventName, new DocumentUpdated(document.id, document));
  }
}
