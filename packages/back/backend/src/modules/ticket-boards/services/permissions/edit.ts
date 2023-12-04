import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { PermissionEntityType } from "@app/shared-enums";

import { EditPermissionInterface, EditPermissionService } from "modules/permissions";

import { GetTicketBoardService } from "../boards/get";

@Injectable()
export class EditTicketBoardPermissionsService {
  constructor(
    private getTicketBoardService: GetTicketBoardService,
    @Inject(forwardRef(() => EditPermissionService)) private editPermissionService: EditPermissionService,
  ) {}

  async editTicketBoardPermission(boardId: string, data: EditPermissionInterface & { userId: string }) {
    await this.getTicketBoardService.getTicketBoardOrFail(boardId);

    await this.editPermissionService.editPermissionOrFail(
      { entityId: boardId, entityType: PermissionEntityType.TICKET_BOARD, userId: data.userId },
      data,
    );
  }
}
