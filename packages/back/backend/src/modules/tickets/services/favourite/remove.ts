import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOptionsWhere, Repository } from "typeorm";
import { Transactional } from "typeorm-transactional";

import { TicketEntity } from "entities/Ticket";
import { TicketFavouriteEntity } from "entities/Ticket/Favourite";

import { getCurrentUser } from "modules/auth";

@Injectable()
export class RemoveTicketFavouritesService {
  constructor(
    @InjectRepository(TicketEntity) private ticketRepository: Repository<TicketEntity>,
    @InjectRepository(TicketFavouriteEntity) private favouriteRepository: Repository<TicketFavouriteEntity>,
  ) {}

  @Transactional()
  async removeFavouriteOrFail(ticketId: string, { forAllUsers }: { forAllUsers: boolean }) {
    const ticketFindOptions: FindOptionsWhere<TicketEntity> = { id: ticketId };
    const favouriteFindOptions: FindOptionsWhere<TicketFavouriteEntity> = {};

    const currentUser = getCurrentUser();
    ticketFindOptions.client = { id: currentUser.clientId };

    if (!forAllUsers) {
      favouriteFindOptions.user = { id: currentUser.userId };
    }

    const ticket = await this.ticketRepository.findOneOrFail({
      where: ticketFindOptions,
    });

    favouriteFindOptions.ticket = { id: ticket.id };

    await this.favouriteRepository.delete(favouriteFindOptions);
  }
}
