import {
  ElasticDocumentData,
  ElasticService,
  TypeormUpdateEntity,
  filterHtml,
  typeormUpdateNullOrUndefined,
} from "@app/back-kit";
import { DictionaryTypes, TicketPriorities } from "@app/shared-enums";
import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Transactional } from "typeorm-transactional";
import { EventEmitter2 } from "@nestjs/event-emitter";

import { TicketEntity } from "entities/Ticket";

import { GetDictionaryValueService } from "modules/dictionary";

import { GetTicketsForEditService } from "./get-for-update";
import { ReorderTicketsService } from "./reorder";
import { TicketUpdated } from "../../events/TicketUpdated";

interface UpdateTicketInterface {
  name?: string;
  description?: string;
  deadlineAt?: Date | null;
  responsibleId?: string | null;
  customerId?: string | null;
  priority?: TicketPriorities;
  typeKey?: string | null;
  statusKey?: string;
}

@Injectable()
export class EditTicketsService {
  constructor(
    @InjectRepository(TicketEntity) private ticketsRepository: Repository<TicketEntity>,
    private eventEmitter: EventEmitter2,
    private getTicketsForEditService: GetTicketsForEditService,
    private reorderTicketsService: ReorderTicketsService,
    @Inject(forwardRef(() => GetDictionaryValueService)) private getDictionaryValueService: GetDictionaryValueService,
    private elasticService: ElasticService,
  ) {}

  @Transactional()
  async updateTicketOrFail(
    ticketId: string,
    data: UpdateTicketInterface,
    options: { waitForUpdateEventComplete?: boolean } = {},
  ) {
    const ticket = await this.getTicketsForEditService.getTicketForUpdating(ticketId, { loadBoard: true });

    const updateOptionsORM: TypeormUpdateEntity<TicketEntity> = {};
    const updateOptionsElastic: ElasticDocumentData = {};
    if (data.name) {
      updateOptionsORM.name = data.name;
      updateOptionsElastic.name = data.name;
    }
    if (data.description) {
      updateOptionsORM.description = filterHtml(data.description);
      updateOptionsElastic.description = updateOptionsORM.description;
    }
    if (data.deadlineAt !== undefined) {
      updateOptionsORM.deadlineAt = data.deadlineAt;
      updateOptionsElastic.deadlineAt = data.deadlineAt?.toISOString();
    }
    if (data.priority) {
      updateOptionsORM.priority = data.priority;
      updateOptionsElastic.priority = Object.values(TicketPriorities).indexOf(data.priority);
    }
    if (data.statusKey && ticket.status.key !== data.statusKey) {
      const newStatus = await this.getDictionaryValueService.getDictionaryValueOrFail(
        data.statusKey,
        DictionaryTypes.TICKET_STATUS,
      );
      const currentTickets = await this.ticketsRepository.find({ where: { status: { id: newStatus.id } } });

      await this.reorderTicketsService.reorderTicketsOrFail(
        data.statusKey,
        [...currentTickets.map((ticket) => ticket.id), ticket.id],
        { emitTicketUpdatedEvent: false },
      );
    }

    const typeId = data.typeKey
      ? await this.getDictionaryValueService
          .getDictionaryValueOrFail(data.typeKey, DictionaryTypes.TICKET_TYPE)
          .then((type) => type.id)
      : data.typeKey;

    Object.assign(
      updateOptionsORM,
      typeormUpdateNullOrUndefined<string>(data.responsibleId, "responsible"),
      typeormUpdateNullOrUndefined<string>(data.customerId, "customer"),
      typeormUpdateNullOrUndefined<string>(typeId, "type"),
    );

    await Promise.all([
      this.ticketsRepository.update(ticket.id, updateOptionsORM),
      this.elasticService.updateDocumentOrFail(
        this.elasticService.getDocumentId("tickets", ticket.id),
        Object.assign(
          {},
          updateOptionsElastic,
          this.elasticService.updateNullOrUndefined<string>(data.customerId, "customerId"),
          this.elasticService.updateNullOrUndefined<string>(data.responsibleId, "responsibleId"),
          this.elasticService.updateNullOrUndefined<string>(data.typeKey, "typeId", typeId),
        ),
      ),
    ]);

    if (options.waitForUpdateEventComplete) {
      await this.eventEmitter.emitAsync(TicketUpdated.eventName, new TicketUpdated(ticket.id, ticket));
    } else {
      this.eventEmitter.emit(TicketUpdated.eventName, new TicketUpdated(ticket.id, ticket));
    }
  }
}
