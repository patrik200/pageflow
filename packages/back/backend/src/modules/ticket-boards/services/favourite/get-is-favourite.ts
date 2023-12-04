import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { TicketBoardFavouriteEntity } from "entities/TicketBoard/Favourite";
import { TicketBoardEntity } from "entities/TicketBoard";

import { getCurrentUser } from "modules/auth";

@Injectable()
export class GetTicketBoardIsFavouritesService {
  constructor(
    @InjectRepository(TicketBoardFavouriteEntity)
    private favouriteRepository: Repository<TicketBoardFavouriteEntity>,
  ) {}

  async getTicketBoardIsFavourite(boardId: string) {
    const favourite = await this.favouriteRepository.findOne({
      where: { board: { id: boardId }, user: { id: getCurrentUser().userId } },
    });

    return !!favourite;
  }

  async loadTicketBoardIsFavouriteOrFail(board: TicketBoardEntity) {
    board.favourite = await this.getTicketBoardIsFavourite(board.id);
    return board;
  }
}
