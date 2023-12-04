import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Transactional } from "typeorm-transactional";

import { TicketEntity } from "entities/Ticket";
import { TicketFavouriteEntity } from "entities/Ticket/Favourite";

import { getCurrentUser } from "modules/auth";

@Injectable()
export class RemoveTicketFavouritesService {
  constructor(
    @InjectRepository(TicketEntity)
    private ticketRepository: Repository<TicketEntity>,
    @InjectRepository(TicketFavouriteEntity)
    private favouriteRepository: Repository<TicketFavouriteEntity>,
  ) {}

  @Transactional()
  async removeFavouriteOrFail(ticketId: string) {
    const { clientId, userId } = getCurrentUser();
    const ticket = await this.ticketRepository.findOneOrFail({
      withDeleted: true,
      where: { id: ticketId, client: { id: clientId } },
    });
    await this.favouriteRepository.delete({ ticket: { id: ticket.id }, user: { id: userId } });
  }
}
