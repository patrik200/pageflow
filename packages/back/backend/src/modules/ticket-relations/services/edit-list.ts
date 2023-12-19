import { Injectable, Inject, forwardRef } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Transactional } from "typeorm-transactional";
import { TicketRelationTypes } from "@app/shared-enums";

import { TicketRelationEntity } from "entities/Ticket/TicketRelation";

import { GetTicketService } from "modules/tickets";

interface EditTicketRelationInterface {
  relatedTicketId: string;
  type: TicketRelationTypes;
}

@Injectable()
export class EditTicketRelationsService {
  constructor(
    @InjectRepository(TicketRelationEntity) private ticketRelationRepository: Repository<TicketRelationEntity>,
    @Inject(forwardRef(() => GetTicketService)) private getTicketService: GetTicketService,
  ) {}

  @Transactional()
  async editTicketRelationsOrFail(ticketId: string, relations: EditTicketRelationInterface[]) {
    const mainTicket = await this.getTicketService.getTicketOrFail(ticketId, "id");

    await this.ticketRelationRepository.delete({ mainTicket: { id: mainTicket.id } });

    const savedRelations = await Promise.all(
      relations.map((relation) =>
        this.ticketRelationRepository.save({
          mainTicket: { id: mainTicket.id },
          relatedTicket: { id: relation.relatedTicketId },
          type: relation.type,
        }),
      ),
    );

    return savedRelations.map((entity) => ({ id: entity.id }));
  }
}
