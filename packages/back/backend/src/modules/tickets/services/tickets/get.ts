import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { PermissionEntityType } from "@app/shared-enums";

import { TicketEntity } from "entities/Ticket";

import { getCurrentUser } from "modules/auth";
import { PermissionAccessService } from "modules/permissions";

import { GetTicketIsFavouritesService } from "../favourite/get-is-favourite";

@Injectable()
export class GetTicketService {
  constructor(
    @InjectRepository(TicketEntity) private ticketsRepository: Repository<TicketEntity>,
    private getTicketIsFavouritesService: GetTicketIsFavouritesService,
    @Inject(forwardRef(() => PermissionAccessService)) private permissionAccessService: PermissionAccessService,
  ) {}

  async getTicketOrFail(
    ticketId: string,
    {
      loadFavourites,
      checkPermissions = true,
      ...options
    }: {
      loadFavourites?: boolean;
      checkPermissions?: boolean;
      loadResponsible?: boolean;
      loadResponsibleAvatar?: boolean;
      loadCustomer?: boolean;
      loadCustomerAvatar?: boolean;
      loadAuthor?: boolean;
      loadAuthorAvatar?: boolean;
      loadFiles?: boolean;
      loadStatus?: boolean;
      loadType?: boolean;
      loadClient?: boolean;
    } = {},
  ) {
    const ticket = await this.ticketsRepository.findOneOrFail({
      where: { id: ticketId, client: { id: getCurrentUser().clientId } },
      relations: {
        board: true,
        client: options.loadClient,
        responsible: options.loadResponsible
          ? {
              avatar: options.loadResponsibleAvatar,
            }
          : false,
        customer: options.loadCustomer
          ? {
              avatar: options.loadCustomerAvatar,
            }
          : false,
        author: options.loadAuthor
          ? {
              avatar: options.loadAuthorAvatar,
            }
          : false,
        files: options.loadFiles ? { file: true } : false,
        status: options.loadStatus,
        type: options.loadType,
      },
    });

    if (checkPermissions)
      await this.permissionAccessService.validateToRead(
        { entityId: ticket.board.id, entityType: PermissionEntityType.TICKET_BOARD },
        true,
      );

    if (loadFavourites) await this.getTicketIsFavouritesService.loadTicketIsFavourite(ticket);

    return ticket;
  }
}
