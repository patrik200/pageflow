import { Injectable } from "@nestjs/common";
import { ElasticService } from "@app/back-kit";
import { TicketPriorities } from "@app/shared-enums";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { TicketEntity } from "entities/Ticket";

@Injectable()
export class CreateTicketElasticService {
  constructor(
    @InjectRepository(TicketEntity) private ticketRepository: Repository<TicketEntity>,
    private elasticService: ElasticService,
  ) {}

  async elasticCreateTicketIndexOrFail(ticketId: string, refreshIndex?: boolean) {
    const ticket = await this.ticketRepository.findOneOrFail({
      where: { id: ticketId },
      relations: {
        client: true,
        board: true,
        author: true,
        customer: true,
        responsible: true,
        status: true,
        type: true,
      },
    });

    await this.elasticService.addDocumentOrFail(
      this.elasticService.getDocumentId("tickets", ticket.id),
      {
        clientId: ticket.client.id,
        boardId: ticket.board.id,
        name: ticket.name,
        slug: ticket.slug,
        description: ticket.description ?? "",
        authorId: ticket.author.id,
        customerId: ticket.customer?.id,
        responsibleId: ticket.responsible?.id,
        priority: Object.values(TicketPriorities).indexOf(ticket.priority),
        statusId: ticket.status.id,
        typeId: ticket.type?.id,
        deadlineAt: ticket.deadlineAt?.toISOString(),
        createdAt: ticket.createdAt?.toISOString(),
      },
      refreshIndex,
    );
  }
}
