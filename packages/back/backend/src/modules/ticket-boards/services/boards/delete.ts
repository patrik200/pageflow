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

import { TicketBoardDeleted } from "../../events/TicketBoardDeleted";

@Injectable()
export class DeleteTicketBoardService {
  constructor(
    @InjectRepository(TicketBoardEntity) private ticketBoardsRepository: Repository<TicketBoardEntity>,
    @Inject(forwardRef(() => DeleteTicketService)) private deleteTicketService: DeleteTicketService,
    private eventEmitter: EventEmitter2,
    @Inject(forwardRef(() => DeletePermissionService)) private deletePermissionService: DeletePermissionService,
    @Inject(forwardRef(() => PermissionAccessService)) private permissionAccessService: PermissionAccessService,
  ) {}

  @Transactional()
  async deleteTicketBoardOrFail(boardId: string, { checkPermissions = true } = {}) {
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

    await Promise.all(board.tickets.map((ticket) => this.deleteTicketService.deleteTicketOrFail(ticket.id)));

    await this.deletePermissionService.deleteAllPermissionsOrFail({
      entityId: board.id,
      entityType: PermissionEntityType.TICKET_BOARD,
    });

    await this.ticketBoardsRepository.delete(board.id);

    this.eventEmitter.emit(TicketBoardDeleted.eventName, new TicketBoardDeleted(board.id));
  }
}
