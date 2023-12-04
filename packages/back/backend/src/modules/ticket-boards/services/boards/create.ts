import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Transactional } from "typeorm-transactional";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { PermissionEntityType, PermissionRole } from "@app/shared-enums";

import { TicketBoardEntity } from "entities/TicketBoard";

import { GetProjectService } from "modules/projects";
import { getCurrentUser } from "modules/auth";
import { CreatePermissionService } from "modules/permissions";

import { TicketBoardCreated } from "../../events/TicketBoardCreated";

interface CreateTicketBoardInterface {
  name: string;
  isPrivate: boolean;
}

@Injectable()
export class CreateTicketBoardService {
  constructor(
    @InjectRepository(TicketBoardEntity) private ticketBoardsRepository: Repository<TicketBoardEntity>,
    @Inject(forwardRef(() => GetProjectService)) private getProjectService: GetProjectService,
    private eventEmitter: EventEmitter2,
    @Inject(forwardRef(() => CreatePermissionService)) private createPermissionService: CreatePermissionService,
  ) {}

  @Transactional()
  async createTicketBoardOrFail(projectId: string | null, data: CreateTicketBoardInterface) {
    const currentUser = getCurrentUser();
    const project = projectId ? await this.getProjectService.getProjectOrFail(projectId) : null;

    const ticketBoard = await this.ticketBoardsRepository.save({
      name: data.name,
      isPrivate: data.isPrivate,
      project,
      client: { id: currentUser.clientId },
      author: { id: currentUser.userId },
    });

    await this.createPermissionService.createPermissionOrFail(
      { entityId: ticketBoard.id, entityType: PermissionEntityType.TICKET_BOARD },
      { role: PermissionRole.OWNER, userId: currentUser.userId },
      { validateCurrentUserPermissions: false },
    );

    this.eventEmitter.emit(TicketBoardCreated.eventName, new TicketBoardCreated(ticketBoard));

    return ticketBoard.id;
  }
}
