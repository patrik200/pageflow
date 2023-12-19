import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOptionsWhere, Repository } from "typeorm";
import { Transactional } from "typeorm-transactional";

import { TicketBoardEntity } from "entities/TicketBoard";
import { TicketBoardFavouriteEntity } from "entities/TicketBoard/Favourite";

import { getCurrentUser } from "modules/auth";

@Injectable()
export class RemoveTicketBoardFavouritesService {
  constructor(
    @InjectRepository(TicketBoardEntity) private ticketBoardRepository: Repository<TicketBoardEntity>,
    @InjectRepository(TicketBoardFavouriteEntity) private favouriteRepository: Repository<TicketBoardFavouriteEntity>,
  ) {}

  @Transactional()
  async removeFavouriteOrFail(boardId: string, { forAllUsers }: { forAllUsers: boolean }) {
    const boardFindOptions: FindOptionsWhere<TicketBoardEntity> = { id: boardId };
    const favouriteFindOptions: FindOptionsWhere<TicketBoardFavouriteEntity> = {};

    const currentUser = getCurrentUser();
    boardFindOptions.client = { id: currentUser.clientId };

    if (!forAllUsers) {
      favouriteFindOptions.user = { id: currentUser.userId };
    }

    const board = await this.ticketBoardRepository.findOneOrFail({
      where: boardFindOptions,
    });

    favouriteFindOptions.board = { id: board.id };

    await this.favouriteRepository.delete(favouriteFindOptions);
  }
}
