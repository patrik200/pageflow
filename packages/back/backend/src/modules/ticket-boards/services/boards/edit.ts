import { TypeormUpdateEntity } from "@app/back-kit";
import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Transactional } from "typeorm-transactional";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { PermissionEntityType } from "@app/shared-enums";

import { TicketBoardEntity } from "entities/TicketBoard";

import { PermissionAccessService } from "modules/permissions";
import { getCurrentUser } from "modules/auth";

import { TicketBoardUpdated } from "../../events/TicketBoardUpdated";

interface UpdateTicketBoardInterface {
  name?: string;
  isPrivate?: boolean;
}

@Injectable()
export class EditTicketBoardService {
  constructor(
    @InjectRepository(TicketBoardEntity) private ticketBoardsRepository: Repository<TicketBoardEntity>,
    private eventEmitter: EventEmitter2,
    @Inject(forwardRef(() => PermissionAccessService)) private permissionAccessService: PermissionAccessService,
  ) {}

  @Transactional()
  async updateTicketBoardOrFail(boardId: string, data: UpdateTicketBoardInterface) {
    await this.permissionAccessService.validateToEditOrDelete(
      { entityId: boardId, entityType: PermissionEntityType.TICKET_BOARD },
      true,
    );

    const board = await this.ticketBoardsRepository.findOneOrFail({
      where: { id: boardId, client: { id: getCurrentUser().clientId } },
    });

    const updateOptions: TypeormUpdateEntity<TicketBoardEntity> = {};
    if (data.name) updateOptions.name = data.name;
    if (data.isPrivate !== undefined) updateOptions.isPrivate = data.isPrivate;

    await this.ticketBoardsRepository.update(board.id, updateOptions);

    this.eventEmitter.emit(TicketBoardUpdated.eventName, new TicketBoardUpdated(board.id));
  }
}
