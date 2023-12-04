import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { PermissionEntityType } from "@app/shared-enums";

import { TicketBoardEntity } from "entities/TicketBoard";

import { PermissionAccessService } from "modules/permissions";

import { GetTicketBoardIsFavouritesService } from "../favourite/get-is-favourite";

@Injectable()
export class GetTicketBoardService {
  constructor(
    @InjectRepository(TicketBoardEntity) private ticketsRepository: Repository<TicketBoardEntity>,
    private getTicketBoardIsFavouritesService: GetTicketBoardIsFavouritesService,
    @Inject(forwardRef(() => PermissionAccessService)) private permissionAccessService: PermissionAccessService,
  ) {}

  async getTicketBoardOrFail(
    boardId: string,
    {
      loadFavourites,
      checkPermissions = true,
      loadPermissions,
      ...options
    }: {
      loadFavourites?: boolean;
      checkPermissions?: boolean;
      loadPermissions?: boolean;
      loadAuthor?: boolean;
      loadAuthorAvatar?: boolean;
    } = {},
  ) {
    if (checkPermissions) {
      await this.permissionAccessService.validateToRead(
        { entityId: boardId, entityType: PermissionEntityType.TICKET_BOARD },
        true,
      );
    }

    const board = await this.ticketsRepository.findOneOrFail({
      where: { id: boardId },
      relations: {
        author: options.loadAuthor
          ? {
              avatar: options.loadAuthorAvatar,
            }
          : undefined,
      },
    });

    await Promise.all([
      loadFavourites && this.getTicketBoardIsFavouritesService.loadTicketBoardIsFavouriteOrFail(board),
      loadPermissions &&
        this.permissionAccessService.loadPermissions(
          { entityId: board.id, entityType: PermissionEntityType.TICKET_BOARD },
          board,
          { loadUser: true },
        ),
    ]);

    return board;
  }
}
