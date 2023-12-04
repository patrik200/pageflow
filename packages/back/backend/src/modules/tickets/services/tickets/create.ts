import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { filterHtml } from "@app/back-kit";
import { DictionaryTypes, TicketPriorities } from "@app/shared-enums";
import { Transactional } from "typeorm-transactional";
import { EventEmitter2 } from "@nestjs/event-emitter";

import { TicketEntity } from "entities/Ticket";

import { getCurrentUser } from "modules/auth";
import { GetDictionaryValueService } from "modules/dictionary";
import { GetTicketBoardService } from "modules/ticket-boards";
import { GetUserService } from "modules/users";

import { TicketCreated } from "../../events/TicketCreated";
import { CreateTicketElasticService } from "./create-elastic";

interface CreateTicketInterface {
  statusKey: string;
  typeKey?: string;
  name: string;
  description?: string;
  deadlineAt?: Date;
  responsibleId?: string;
  customerId?: string;
  priority?: TicketPriorities;
}

@Injectable()
export class CreateTicketService {
  constructor(
    @InjectRepository(TicketEntity) private ticketsRepository: Repository<TicketEntity>,
    @Inject(forwardRef(() => GetTicketBoardService)) private getTicketBoardService: GetTicketBoardService,
    @Inject(forwardRef(() => GetDictionaryValueService)) private getDictionaryValueService: GetDictionaryValueService,
    @Inject(forwardRef(() => GetUserService)) private getUserService: GetUserService,
    private eventEmitter: EventEmitter2,
    private createTicketElasticService: CreateTicketElasticService,
  ) {}

  private async getStatus(statusKey: string) {
    return await this.getDictionaryValueService.getDictionaryValueOrFail(statusKey, DictionaryTypes.TICKET_STATUS);
  }

  private async getType(typeKey: string | undefined) {
    if (!typeKey) return null;
    return await this.getDictionaryValueService.getDictionaryValueOrFail(typeKey, DictionaryTypes.TICKET_TYPE);
  }

  private async getCustomer(customerId: string | undefined) {
    if (!customerId) return null;
    return await this.getUserService.getUserOrFail(customerId, "id");
  }

  private async getResponsible(responsibleId: string | undefined) {
    if (!responsibleId) return null;
    return await this.getUserService.getUserOrFail(responsibleId, "id");
  }

  @Transactional()
  async createTicketOrFail(boardId: string, data: CreateTicketInterface) {
    const currentUser = getCurrentUser();
    const board = await this.getTicketBoardService.getTicketBoardOrFail(boardId);

    const status = await this.getStatus(data.statusKey);
    const type = await this.getType(data.typeKey);
    const customer = await this.getCustomer(data.customerId);
    const responsible = await this.getResponsible(data.responsibleId);

    const ticketCounts = await this.ticketsRepository.count({
      where: {
        status: { id: status.id },
        client: { id: currentUser.clientId },
        board: { id: board.id },
      },
    });

    const savedTicket = await this.ticketsRepository.save({
      status: { id: status.id },
      type: type ? { id: type.id } : undefined,
      sort: ticketCounts,
      client: { id: currentUser.clientId },
      board: { id: board.id },
      author: { id: currentUser.userId },
      name: data.name,
      description: data.description ? filterHtml(data.description) : undefined,
      deadlineAt: data.deadlineAt,
      responsible: responsible ? { id: responsible.id } : undefined,
      customer: customer ? { id: customer.id } : undefined,
      priority: data.priority ?? TicketPriorities.MEDIUM,
    });

    await this.createTicketElasticService.elasticCreateTicketIndexOrFail(savedTicket.id);

    this.eventEmitter.emit(TicketCreated.eventName, new TicketCreated(savedTicket.id));

    return savedTicket.id;
  }
}
