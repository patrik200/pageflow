import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Transactional } from "typeorm-transactional";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { PermissionEntityType } from "@app/shared-enums";

import { TicketBoardEntity } from "entities/TicketBoard";

import { getCurrentUser } from "modules/auth";
import { DeleteTicketService } from "modules/tickets";
import { DeletePermissionService, PermissionAccessService } from "modules/permissions";

import { RemoveTicketBoardFavouritesService } from "../favourite/remove";
import { TicketBoardDeleted } from "../../events/TicketBoardDeleted";

@Injectable()
export class DeleteTicketBoardService {
  constructor(
    @InjectRepository(TicketBoardEntity) private ticketBoardsRepository: Repository<TicketBoardEntity>,
    @Inject(forwardRef(() => DeleteTicketService)) private deleteTicketService: DeleteTicketService,
    private eventEmitter: EventEmitter2,
    @Inject(forwardRef(() => DeletePermissionService)) private deletePermissionService: DeletePermissionService,
    @Inject(forwardRef(() => PermissionAccessService)) private permissionAccessService: PermissionAccessService,
    private removeTicketBoardFavouritesService: RemoveTicketBoardFavouritesService,
  ) {}

  @Transactional()
  async deleteTicketBoardOrFail(
    boardId: string,
    { checkPermissions = true, emitEvents = true }: { checkPermissions?: boolean; emitEvents?: boolean } = {},
  ) {
    if (checkPermissions) {
      await this.permissionAccessService.validateToEditOrDelete(
        { entityId: boardId, entityType: PermissionEntityType.TICKET_BOARD },
        true,
      );
    }

    const board = await this.ticketBoardsRepository.findOneOrFail({
      where: { id: boardId, client: { id: getCurrentUser().clientId } },
      relations: { tickets: true },
    });

    await Promise.all(
      board.tickets.map((ticket) => this.deleteTicketService.deleteTicketOrFail(ticket.id, { emitEvents: false })),
    );

    await Promise.all([
      this.deletePermissionService.deleteAllPermissionsOrFail({
        entityId: board.id,
        entityType: PermissionEntityType.TICKET_BOARD,
      }),
      this.removeTicketBoardFavouritesService.removeFavouriteOrFail(board.id, { forAllUsers: true }),
    ]);

    await this.ticketBoardsRepository.delete(board.id);

    if (emitEvents) this.eventEmitter.emit(TicketBoardDeleted.eventName, new TicketBoardDeleted(board.id));
  }
}
