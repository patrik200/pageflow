import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { TicketEntity } from "entities/Ticket";

import { getCurrentUser } from "modules/auth";

@Injectable()
export class GetTicketsForEditService {
  constructor(@InjectRepository(TicketEntity) private ticketsRepository: Repository<TicketEntity>) {}

  async getTicketForUpdating(ticketId: string, options: { loadBoard?: boolean; loadComments?: boolean } = {}) {
    const { clientId } = getCurrentUser();
    return await this.ticketsRepository.findOneOrFail({
      where: { id: ticketId, client: { id: clientId } },
      relations: {
        client: true,
        status: true,
        type: true,
        responsible: true,
        customer: true,
        board: options.loadBoard,
        files: { file: true },
        comments: options.loadComments,
      },
    });
  }
}
