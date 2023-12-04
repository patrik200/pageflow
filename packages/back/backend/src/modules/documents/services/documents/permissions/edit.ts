import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { PermissionEntityType } from "@app/shared-enums";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { ServiceError } from "@app/back-kit";

import { EditPermissionInterface, EditPermissionService } from "modules/permissions";

import { GetDocumentService } from "../get";
import { DocumentUpdated } from "../../../events/DocumentUpdated";

@Injectable()
export class EditDocumentPermissionsService {
  constructor(
    private getDocumentService: GetDocumentService,
    @Inject(forwardRef(() => EditPermissionService)) private editPermissionService: EditPermissionService,
    private eventEmitter: EventEmitter2,
  ) {}

  async editDocumentPermission(documentId: string, data: EditPermissionInterface & { userId: string }) {
    const document = await this.getDocumentService.getDocumentOrFail(documentId, {
      loadPermissions: true,
      permissionSelectOptions: { loadUser: true },
      loadResponsibleUser: true,
    });

    if (document.responsibleUser?.id === data.userId)
      throw new ServiceError("permissions", "Нельзя редактировать доступ ответственного сотрудника");

    await this.editPermissionService.editPermissionOrFail(
      { entityId: documentId, entityType: PermissionEntityType.DOCUMENT, userId: data.userId },
      data,
    );

    this.eventEmitter.emit(DocumentUpdated.eventName, new DocumentUpdated(document.id, document));
  }
}
