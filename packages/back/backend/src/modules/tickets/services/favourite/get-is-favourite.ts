import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { TicketFavouriteEntity } from "entities/Ticket/Favourite";
import { TicketEntity } from "entities/Ticket";

import { getCurrentUser } from "modules/auth";

@Injectable()
export class GetTicketIsFavouritesService {
  constructor(
    @InjectRepository(TicketFavouriteEntity)
    private favouriteRepository: Repository<TicketFavouriteEntity>,
  ) {}

  async getTicketIsFavourite(ticketId: string) {
    const favourite = await this.favouriteRepository.findOne({
      where: { ticket: { id: ticketId }, user: { id: getCurrentUser().userId } },
    });

    return !!favourite;
  }

  async loadTicketIsFavourite(ticket: TicketEntity) {
    ticket.favourite = await this.getTicketIsFavourite(ticket.id);
    return ticket;
  }
}
