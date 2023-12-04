import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { In, Repository } from "typeorm";
import { Transactional } from "typeorm-transactional";
import { PermissionEntityType } from "@app/shared-enums";

import { TicketBoardEntity } from "entities/TicketBoard";
import { TicketBoardFavouriteEntity } from "entities/TicketBoard/Favourite";

import { getCurrentUser } from "modules/auth";
import { PermissionAccessService } from "modules/permissions";

@Injectable()
export class GetTicketBoardFavouritesListService {
  constructor(
    @InjectRepository(TicketBoardEntity)
    private ticketBoardRepository: Repository<TicketBoardEntity>,
    @InjectRepository(TicketBoardFavouriteEntity)
    private favouriteRepository: Repository<TicketBoardFavouriteEntity>,
    @Inject(forwardRef(() => PermissionAccessService)) private permissionAccessService: PermissionAccessService,
  ) {}

  @Transactional()
  async getFavouritesOrFail() {
    const favourites = await this.favouriteRepository.find({
      where: { user: { id: getCurrentUser().userId } },
      relations: { board: true },
    });

    const boards = await this.ticketBoardRepository.find({
      withDeleted: true,
      where: { id: In(favourites.map((favourite) => favourite.board.id)) },
    });

    const boardsWithPermissions = await Promise.all(
      boards.map(async (board) => ({
        board,
        hasAccess: await this.permissionAccessService.validateToRead(
          { entityId: board.id, entityType: PermissionEntityType.TICKET_BOARD },
          false,
        ),
      })),
    );

    return boardsWithPermissions.filter(({ hasAccess }) => hasAccess).map(({ board }) => board);
  }
}
