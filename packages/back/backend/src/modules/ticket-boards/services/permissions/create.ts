import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { PermissionEntityType } from "@app/shared-enums";

import { CreatePermissionInterface, CreatePermissionService } from "modules/permissions";

import { GetTicketBoardService } from "../boards/get";

@Injectable()
export class CreateTicketBoardPermissionsService {
  constructor(
    private getTicketBoardService: GetTicketBoardService,
    @Inject(forwardRef(() => CreatePermissionService)) private createPermissionService: CreatePermissionService,
  ) {}

  async createTicketBoardPermission(boardId: string, data: CreatePermissionInterface) {
    await this.getTicketBoardService.getTicketBoardOrFail(boardId);

    await this.createPermissionService.createPermissionOrFail(
      { entityId: boardId, entityType: PermissionEntityType.TICKET_BOARD },
      data,
      { validateCurrentUserPermissions: true },
    );
  }
}
