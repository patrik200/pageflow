import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Transactional } from "typeorm-transactional";

import { TicketBoardEntity } from "entities/TicketBoard";

@Injectable()
export class IncrementNextTicketNumberService {
  constructor(@InjectRepository(TicketBoardEntity) private ticketBoardsRepository: Repository<TicketBoardEntity>) {}

  @Transactional()
  async dangerIncrementNextTicketNumberOrFail(boardId: string) {
    await this.ticketBoardsRepository.update(boardId, {
      nextTicketNumber: () => "nextTicketNumber + 1",
    });
  }
}
