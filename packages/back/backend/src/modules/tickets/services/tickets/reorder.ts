import { ElasticDocumentData, ElasticService, ServiceError } from "@app/back-kit";
import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { IsolationLevel, Transactional } from "typeorm-transactional";
import { DictionaryTypes } from "@app/shared-enums";
import { EventEmitter2 } from "@nestjs/event-emitter";

import { TicketEntity } from "entities/Ticket";

import { GetDictionaryValueService } from "modules/dictionary";
import { getCurrentUser } from "modules/auth";

import { TicketUpdated } from "../../events/TicketUpdated";

@Injectable()
export class ReorderTicketsService {
  constructor(
    @InjectRepository(TicketEntity) private ticketsRepository: Repository<TicketEntity>,
    @Inject(forwardRef(() => GetDictionaryValueService)) private getDictionaryValueService: GetDictionaryValueService,
    private eventEmitter: EventEmitter2,
    private elasticService: ElasticService,
  ) {}

  @Transactional({ isolationLevel: IsolationLevel.SERIALIZABLE })
  async reorderTicketsOrFail(
    newStatusKey: string,
    ticketIds: string[],
    { emitTicketUpdatedEvent }: { emitTicketUpdatedEvent: boolean },
  ) {
    const newStatus = await this.getDictionaryValueService.getDictionaryValueOrFail(
      newStatusKey,
      DictionaryTypes.TICKET_STATUS,
    );

    const currentUser = getCurrentUser();

    const orderedAllIncomeTickets = await Promise.all(
      ticketIds.map((ticketId) =>
        this.ticketsRepository.findOneOrFail({
          where: { id: ticketId, client: { id: currentUser.clientId } },
          relations: { board: true, status: true },
        }),
      ),
    );

    if (orderedAllIncomeTickets.length === 0)
      throw new ServiceError("tickets", "Переданы неверные идентификаторы тикетов");

    const boardId = orderedAllIncomeTickets[0].board.id;

    const isValidTicketsBoardId = orderedAllIncomeTickets.every((ticket) => ticket.board.id === boardId);
    if (!isValidTicketsBoardId) throw new ServiceError("ticket", "Переданы тикеты с разных досок");

    await this.setInitialSortingAndNewStatusForTickets(orderedAllIncomeTickets, newStatus.id);

    if (emitTicketUpdatedEvent) {
      orderedAllIncomeTickets.forEach((ticket) =>
        this.eventEmitter.emit(TicketUpdated.eventName, new TicketUpdated(ticket.id, ticket)),
      );
    }
  }

  @Transactional()
  private async setOrderingToTickets(orderedTicketIds: string[], baseOrderIndex: number) {
    const results = await Promise.all(
      orderedTicketIds.map((ticketId, index) =>
        this.ticketsRepository.update(ticketId, { sort: index + baseOrderIndex }),
      ),
    );

    return results.length;
  }

  private async setInitialSortingAndNewStatusForTickets(allIncomeTickets: TicketEntity[], newStatusId: string) {
    const orderedAllTicketsInStatusOnBoard = await this.ticketsRepository.find({
      where: { board: { id: allIncomeTickets[0].board.id }, status: { id: newStatusId } },
      order: { sort: "ASC" },
    });

    const allIncomeTicketsMap = new Map(allIncomeTickets.map((ticket) => [ticket.id, ticket]));

    const baseOrderIndex = await this.setOrderingToTickets(
      orderedAllTicketsInStatusOnBoard
        .filter((ticketOnBoard) => !allIncomeTicketsMap.has(ticketOnBoard.id))
        .map((ticketOnBoard) => ticketOnBoard.id),
      0,
    );

    const allIncomeTicketIds = allIncomeTickets.map((ticket) => ticket.id);

    await Promise.all([
      this.setOrderingToTickets(allIncomeTicketIds, baseOrderIndex),
      this.ticketsRepository.update(allIncomeTicketIds, { status: { id: newStatusId } }),
      Promise.all(
        allIncomeTicketIds.map((ticketId) =>
          this.elasticService.updateDocumentOrFail(
            this.elasticService.getDocumentId("tickets", ticketId),
            Object.assign(
              {} as ElasticDocumentData,
              this.elasticService.updateNullOrUndefined<string>(newStatusId, "statusId"),
            ),
          ),
        ),
      ),
    ]);
  }
}
