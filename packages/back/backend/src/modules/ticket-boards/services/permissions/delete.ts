import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { PermissionEntityType } from "@app/shared-enums";

import { DeletePermissionService } from "modules/permissions";

import { GetTicketBoardService } from "../boards/get";

@Injectable()
export class DeleteTicketBoardPermissionsService {
  constructor(
    private getTicketBoardService: GetTicketBoardService,
    @Inject(forwardRef(() => DeletePermissionService)) private deletePermissionService: DeletePermissionService,
  ) {}

  async deleteTicketBoardPermission(boardId: string, data: { userId: string }) {
    await this.getTicketBoardService.getTicketBoardOrFail(boardId);

    await this.deletePermissionService.deletePermissionOrFail({
      entityId: boardId,
      entityType: PermissionEntityType.TICKET_BOARD,
      userId: data.userId,
    });
  }
}
