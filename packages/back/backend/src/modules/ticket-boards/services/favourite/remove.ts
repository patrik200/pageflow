import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Transactional } from "typeorm-transactional";

import { TicketBoardEntity } from "entities/TicketBoard";
import { TicketBoardFavouriteEntity } from "entities/TicketBoard/Favourite";

import { getCurrentUser } from "modules/auth";

@Injectable()
export class RemoveTicketBoardFavouritesService {
  constructor(
    @InjectRepository(TicketBoardEntity)
    private ticketBoardRepository: Repository<TicketBoardEntity>,
    @InjectRepository(TicketBoardFavouriteEntity)
    private favouriteRepository: Repository<TicketBoardFavouriteEntity>,
  ) {}

  @Transactional()
  async removeFavouriteOrFail(boardId: string) {
    const { clientId, userId } = getCurrentUser();
    const ticket = await this.ticketBoardRepository.findOneOrFail({
      withDeleted: true,
      where: { id: boardId, client: { id: clientId } },
    });
    await this.favouriteRepository.delete({ board: { id: ticket.id }, user: { id: userId } });
  }
}
