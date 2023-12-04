import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Transactional } from "typeorm-transactional";

import { TicketBoardEntity } from "entities/TicketBoard";
import { TicketBoardFavouriteEntity } from "entities/TicketBoard/Favourite";

import { getCurrentUser } from "modules/auth";

@Injectable()
export class AddTicketBoardFavouritesService {
  constructor(
    @InjectRepository(TicketBoardEntity)
    private ticketBoardRepository: Repository<TicketBoardEntity>,
    @InjectRepository(TicketBoardFavouriteEntity)
    private favouriteRepository: Repository<TicketBoardFavouriteEntity>,
  ) {}

  @Transactional()
  async addFavouriteOrFail(boardId: string) {
    const { clientId, userId } = getCurrentUser();
    const board = await this.ticketBoardRepository.findOneOrFail({
      withDeleted: true,
      where: { id: boardId, client: { id: clientId } },
    });
    await this.favouriteRepository.save({ board: { id: board.id }, user: { id: userId } });
  }
}
