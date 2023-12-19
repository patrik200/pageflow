import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Transactional } from "typeorm-transactional";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { PermissionEntityType, PermissionRole } from "@app/shared-enums";
import { ServiceError } from "@app/back-kit";

import { TicketBoardEntity } from "entities/TicketBoard";

import { GetProjectService } from "modules/projects";
import { getCurrentUser } from "modules/auth";
import { CreatePermissionService } from "modules/permissions";

import { TicketBoardCreated } from "../../events/TicketBoardCreated";

interface CreateTicketBoardInterface {
  name: string;
  slug: string;
  isPrivate: boolean;
  validateSlug?: boolean;
}

type CreateTicketBoardIdentifier = {} | { projectId: string };

@Injectable()
export class CreateTicketBoardService {
  constructor(
    @InjectRepository(TicketBoardEntity) private ticketBoardsRepository: Repository<TicketBoardEntity>,
    @Inject(forwardRef(() => GetProjectService)) private getProjectService: GetProjectService,
    private eventEmitter: EventEmitter2,
    @Inject(forwardRef(() => CreatePermissionService)) private createPermissionService: CreatePermissionService,
  ) {}

  private async getIdentifierOptions(identifier: CreateTicketBoardIdentifier) {
    if ("projectId" in identifier) {
      const project = await this.getProjectService.getProjectOrFail(identifier.projectId);
      return { project: { id: project.id } };
    }

    return {};
  }

  private validateSlug(slug: string) {
    if (slug.length > 16) return false;
    return /[A-Z]/g.test(slug);
  }

  @Transactional()
  async createTicketBoardOrFail(identifier: CreateTicketBoardIdentifier, data: CreateTicketBoardInterface) {
    const currentUser = getCurrentUser();
    const resultIdentifier = await this.getIdentifierOptions(identifier);

    const slug = data.slug.toUpperCase();
    if ((data.validateSlug ?? true) && !this.validateSlug(slug))
      throw new ServiceError(
        "slug",
        "Недопустимые символы в идентификаторе. Разрешены только буквы английского алфавита. Максимальная длина 16 символов.",
      );

    const existingBoard = await this.ticketBoardsRepository.findOne({
      where: {
        slug,
        client: { id: currentUser.clientId },
        ...resultIdentifier,
      },
    });

    if (existingBoard) throw new ServiceError("slug", "Доску с таким идентификатором нельзя создать. Укажите другую");

    const ticketBoard = await this.ticketBoardsRepository.save({
      name: data.name,
      isPrivate: data.isPrivate,
      client: { id: currentUser.clientId },
      author: { id: currentUser.userId },
      slug,
      ...resultIdentifier,
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
