import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { In, Repository } from "typeorm";
import { Transactional } from "typeorm-transactional";
import { PermissionEntityType } from "@app/shared-enums";

import { TicketEntity } from "entities/Ticket";
import { TicketFavouriteEntity } from "entities/Ticket/Favourite";

import { getCurrentUser } from "modules/auth";
import { PermissionAccessService } from "modules/permissions";

@Injectable()
export class GetTicketFavouritesListService {
  constructor(
    @InjectRepository(TicketEntity) private ticketRepository: Repository<TicketEntity>,
    @InjectRepository(TicketFavouriteEntity) private favouriteRepository: Repository<TicketFavouriteEntity>,
    @Inject(forwardRef(() => PermissionAccessService)) private permissionAccessService: PermissionAccessService,
  ) {}

  @Transactional()
  async getFavouritesOrFail(options: { loadStatus?: boolean } = {}) {
    const favourites = await this.favouriteRepository.find({
      where: { user: { id: getCurrentUser().userId } },
      relations: { ticket: true },
    });

    const tickets = await this.ticketRepository.find({
      withDeleted: true,
      where: { id: In(favourites.map((favourite) => favourite.ticket.id)) },
      relations: {
        status: options.loadStatus,
        board: true,
      },
    });

    const ticketsWithPermissions = await Promise.all(
      tickets.map(async (ticket) => ({
        ticket,
        hasAccess: await this.permissionAccessService.validateToRead(
          { entityId: ticket.board.id, entityType: PermissionEntityType.TICKET_BOARD },
          false,
        ),
      })),
    );

    return ticketsWithPermissions.filter(({ hasAccess }) => hasAccess).map(({ ticket }) => ticket);
  }
}
