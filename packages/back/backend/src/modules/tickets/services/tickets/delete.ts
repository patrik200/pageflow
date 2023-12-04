import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Transactional } from "typeorm-transactional";
import { EventEmitter2, OnEvent } from "@nestjs/event-emitter";
import { ElasticService } from "@app/back-kit";
import { DictionaryTypes } from "@app/shared-enums";

import { TicketEntity } from "entities/Ticket";

import { DeleteTicketCommentsService } from "modules/ticket-comments";
import { DictionaryValueDeleted } from "modules/dictionary";
import { getCurrentUser } from "modules/auth";

import { DeleteTicketFilesService } from "../file/delete";
import { GetTicketsForEditService } from "./get-for-update";
import { EditTicketsService } from "./edit";
import { TicketDeleted } from "../../events/TicketDeleted";

@Injectable()
export class DeleteTicketService {
  constructor(
    @InjectRepository(TicketEntity) private ticketsRepository: Repository<TicketEntity>,
    private eventEmitter: EventEmitter2,
    private getTicketsForEditService: GetTicketsForEditService,
    private deleteTicketFilesService: DeleteTicketFilesService,
    @Inject(forwardRef(() => DeleteTicketCommentsService))
    private deleteTicketCommentsService: DeleteTicketCommentsService,
    private elasticService: ElasticService,
    private editTicketsService: EditTicketsService,
  ) {}

  @Transactional()
  async deleteTicketOrFail(ticketId: string) {
    const ticket = await this.getTicketsForEditService.getTicketForUpdating(ticketId, {
      loadComments: true,
    });

    await Promise.all(
      ticket.files.map((ticketFile) =>
        this.deleteTicketFilesService.deleteTicketFileOrFail(ticket.id, ticketFile.file.id, { emitEvents: false }),
      ),
    );

    await Promise.all(
      ticket.comments.map((comment) =>
        this.deleteTicketCommentsService.deleteCommentOrFail(comment.id, { checkPermissions: false }),
      ),
    );

    await Promise.all([
      this.ticketsRepository.delete(ticket.id),
      this.elasticService.deleteIndexDocumentOrFail(this.elasticService.getDocumentId("tickets", ticket.id)),
    ]);

    this.eventEmitter.emit(TicketDeleted.eventName, new TicketDeleted(ticket.id));
  }

  @Transactional()
  @OnEvent(DictionaryValueDeleted.eventName)
  private async updateTicketTypeWhenDeleteDictionaryValue({ payload }: DictionaryValueDeleted) {
    if (payload.dictionaryType !== DictionaryTypes.TICKET_TYPE) return;

    const tickets = await this.ticketsRepository.find({
      where: {
        type: {
          id: payload.dictionaryValueId,
          dictionary: { type: DictionaryTypes.TICKET_TYPE, client: { id: getCurrentUser().clientId } },
        },
      },
      relations: { type: { dictionary: { client: true } } },
    });

    for (const ticket of tickets) {
      await this.editTicketsService.updateTicketOrFail(
        ticket.id,
        {
          typeKey: payload.replaceDictionaryValueKey,
        },
        { waitForUpdateEventComplete: true },
      );
    }
  }

  @Transactional()
  @OnEvent(DictionaryValueDeleted.eventName)
  private async updateTicketStatusWhenDeleteDictionaryValue({ payload }: DictionaryValueDeleted) {
    if (payload.dictionaryType !== DictionaryTypes.TICKET_STATUS) return;

    const tickets = await this.ticketsRepository.find({
      where: {
        status: {
          id: payload.dictionaryValueId,
          dictionary: { type: DictionaryTypes.TICKET_STATUS, client: { id: getCurrentUser().clientId } },
        },
      },
      relations: { status: { dictionary: { client: true } } },
    });

    for (const ticket of tickets) {
      await this.editTicketsService.updateTicketOrFail(
        ticket.id,
        {
          statusKey: payload.replaceDictionaryValueKey!,
        },
        { waitForUpdateEventComplete: true },
      );
    }
  }
}
