import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { TicketRelationEntity } from "entities/Ticket/TicketRelation";

import { GetTicketService } from "modules/tickets/services/tickets/get";

@Injectable()
export class GetTicketRelationsService {
  constructor(
    @InjectRepository(TicketRelationEntity) private ticketRelationRepository: Repository<TicketRelationEntity>,
    private getTicketService: GetTicketService,
  ) {}

  async getTicketRelationsOrFail(ticketId: string, options: { onlyAsMainRelated: boolean }) {
    const ticket = await this.getTicketService.getTicketOrFail(ticketId, "id");

    return await this.ticketRelationRepository.find({
      where: [
        { mainTicket: { id: ticket.id } },
        { relatedTicket: options.onlyAsMainRelated ? undefined : { id: ticket.id } },
      ],
      relations: {
        mainTicket: true,
        relatedTicket: true,
      },
    });
  }
}
