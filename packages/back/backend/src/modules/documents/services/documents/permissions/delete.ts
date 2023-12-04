import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { PermissionEntityType } from "@app/shared-enums";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { ServiceError } from "@app/back-kit";

import { DeletePermissionService } from "modules/permissions";

import { GetDocumentService } from "../get";
import { DocumentUpdated } from "../../../events/DocumentUpdated";

@Injectable()
export class DeleteDocumentPermissionsService {
  constructor(
    private getDocumentService: GetDocumentService,
    @Inject(forwardRef(() => DeletePermissionService)) private deletePermissionService: DeletePermissionService,
    private eventEmitter: EventEmitter2,
  ) {}

  async deleteDocumentPermission(documentId: string, data: { userId: string }) {
    const document = await this.getDocumentService.getDocumentOrFail(documentId, {
      loadPermissions: true,
      permissionSelectOptions: { loadUser: true },
      loadResponsibleUser: true,
    });

    if (document.responsibleUser?.id === data.userId)
      throw new ServiceError("permissions", "Нельзя удалить доступ ответственного сотрудника");

    await this.deletePermissionService.deletePermissionOrFail({
      entityId: documentId,
      entityType: PermissionEntityType.DOCUMENT,
      userId: data.userId,
    });

    this.eventEmitter.emit(DocumentUpdated.eventName, new DocumentUpdated(document.id, document));
  }
}
