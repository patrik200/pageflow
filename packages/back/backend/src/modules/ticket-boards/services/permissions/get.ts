import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { PermissionEntityType } from "@app/shared-enums";

import { PermissionAccessService, PermissionSelectOptions } from "modules/permissions";

import { GetTicketBoardService } from "../boards/get";

@Injectable()
export class GetTicketBoardPermissionsService {
  constructor(
    @Inject(forwardRef(() => PermissionAccessService)) private permissionAccessService: PermissionAccessService,
    private getTicketBoardService: GetTicketBoardService,
  ) {}

  async getTicketBoardPermissions(boardId: string, selectOptions?: PermissionSelectOptions) {
    await this.getTicketBoardService.getTicketBoardOrFail(boardId);

    return await this.permissionAccessService.getPermissions(
      { entityId: boardId, entityType: PermissionEntityType.TICKET_BOARD },
      selectOptions,
    );
  }
}
