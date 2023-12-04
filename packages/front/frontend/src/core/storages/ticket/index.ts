import { METHODS, PaginatedEntities, emptyPaginatedEntities } from "@app/kit";
import { Inject, Service } from "typedi";
import { action, observable } from "mobx";
import { InternalRequestManager, parseServerError, Storage } from "@app/front-kit";

import { IdEntity } from "core/entities/id";
import { FileEntity } from "core/entities/file";
import { TicketDetailEntity } from "core/entities/ticket/ticketDetail";
import { TicketKanbanColumnEntity } from "core/entities/kanban/kanbanColumn";
import {
  TicketEntity,
  arrayOfTicketEntitiesDecoder,
  paginatedTicketEntitiesDecoder,
} from "core/entities/ticket/ticket";
import { arrayOfChangeFeedEventEntities } from "core/entities/change-feed";

import { IntlDateStorage } from "core/storages/intl-date";
import { DictionariesCommonStorage } from "core/storages/dictionary/common";
import { updateFileArrayRequest } from "core/storages/_common/updateFile";

import { EditTicketEntity } from "./entities/EditTicket";
import { LoadTicketsFilterEntity } from "./entities/LoadTicketsFilterEntity";

@Service()
export class TicketsStorage extends Storage {
  static token = "TicketsStorage";

  constructor() {
    super();
    this.initStorage(TicketsStorage.token);
  }

  @Inject() private requestManager!: InternalRequestManager;
  @Inject() private intlDateStorage!: IntlDateStorage;
  @Inject() private dictionariesCommonStorage!: DictionariesCommonStorage;

  @observable filter!: LoadTicketsFilterEntity;

  @observable kanbanColumns: TicketKanbanColumnEntity[] = [];
  @observable ticketsList = emptyPaginatedEntities as PaginatedEntities<TicketEntity>;
  @observable ticketDetail: TicketDetailEntity | null = null;

  @action initEmptyFilter(boardId: string) {
    this.filter = LoadTicketsFilterEntity.buildEmpty(boardId);
  }

  @action private configureKanbanColumns = (tickets: TicketEntity[], showArchived: boolean) => {
    if (!this.dictionariesCommonStorage.ticketStatusDictionary) return [];

    const columnItems: Record<string, TicketEntity[]> = {};
    tickets.forEach((ticket) => {
      if (columnItems[ticket.status.key]) {
        columnItems[ticket.status.key].push(ticket);
        return;
      }
      columnItems[ticket.status.key] = [ticket];
    });

    return this.dictionariesCommonStorage.ticketStatusDictionary.values
      .filter((dictionaryValue) => showArchived || dictionaryValue.key !== "archived")
      .map((dictionaryValue) =>
        TicketKanbanColumnEntity.buildFromDictionaryValueEntity(
          dictionaryValue,
          (columnItems[dictionaryValue.key] ?? []).sort((t1, t2) => (t1.sort > t2.sort ? 1 : -1)),
        ),
      );
  };

  @action loadTicketsAsKanban = async (filter: LoadTicketsFilterEntity) => {
    try {
      const { array } = await this.requestManager.createRequest({
        url: "/tickets",
        method: METHODS.GET,
        responseDataFieldPath: ["list"],
        serverDataEntityDecoder: arrayOfTicketEntitiesDecoder,
      })({ body: filter.apiReady });
      const intlDate = this.intlDateStorage.getIntlDate();
      array.forEach((ticket) => ticket.configure(intlDate));

      this.ticketsList = emptyPaginatedEntities as PaginatedEntities<TicketEntity>;
      this.kanbanColumns = this.configureKanbanColumns(array, filter.showArchived);

      return { success: true } as const;
    } catch (error) {
      return { success: false, error: parseServerError(error) } as const;
    }
  };

  @action loadTicketsAsListPage = async (filter: LoadTicketsFilterEntity, page: number) => {
    try {
      const ticketsPage = await this.requestManager.createRequest({
        url: "/tickets",
        method: METHODS.GET,
        serverDataEntityDecoder: paginatedTicketEntitiesDecoder,
      })({ body: { page, perPage: 20, ...filter.apiReady } });
      const intlDate = this.intlDateStorage.getIntlDate();
      ticketsPage.items.forEach((ticket) => ticket.configure(intlDate));

      this.ticketsList.pagination = ticketsPage.pagination;
      this.ticketsList.items = page === 1 ? ticketsPage.items : this.ticketsList.items.concat(ticketsPage.items);
      this.kanbanColumns = [];

      return { success: true } as const;
    } catch (error) {
      return { success: false, error: parseServerError(error) } as const;
    }
  };

  @action loadTicketDetail = async (ticketId: string) => {
    try {
      const [ticketDetail, { array: changeFeedEvents }] = await Promise.all([
        this.requestManager.createRequest({
          url: "/tickets/{ticketId}",
          method: METHODS.GET,
          serverDataEntityDecoder: TicketDetailEntity,
        })({ urlParams: { ticketId } }),
        this.requestManager.createRequest({
          url: "/change-feed/ticket/{ticketId}",
          method: METHODS.GET,
          serverDataEntityDecoder: arrayOfChangeFeedEventEntities,
          responseDataFieldPath: ["list"],
        })({ urlParams: { ticketId } }),
      ]);
      ticketDetail.configure(this.intlDateStorage.getIntlDate());
      ticketDetail.changeFeedEvents = changeFeedEvents;
      this.ticketDetail = ticketDetail;
      return { success: true, ticketDetail } as const;
    } catch (error) {
      return { success: false, error: parseServerError(error) } as const;
    }
  };

  @action createTicket = async (entity: EditTicketEntity) => {
    try {
      const result = await this.requestManager.createRequest({
        url: "/tickets",
        method: METHODS.POST,
        serverDataEntityDecoder: IdEntity,
      })({ body: entity.apiReady });

      const { uploadResults, deleteResults } = await updateFileArrayRequest([], entity.files, {
        uploadFile: async (body, attachment) => {
          const file = await this.requestManager.createRequest({
            url: "/tickets/{ticketId}/upload",
            method: METHODS.POST,
            serverDataEntityDecoder: FileEntity,
          })({
            urlParams: { ticketId: result.id },
            body,
            progressReceiver: attachment.setProgress,
          });
          attachment.setProgress(undefined);
          return file;
        },
      });

      return { success: true, uploadResults, deleteResults, ticketId: result.id } as const;
    } catch (error) {
      return { success: false, error: parseServerError(error) } as const;
    }
  };

  @action updateTicket = async (entity: EditTicketEntity) => {
    try {
      await this.requestManager.createRequest({
        url: "/tickets/{id}",
        method: METHODS.PATCH,
      })({ body: entity.apiReady, urlParams: { id: entity.id } });

      const { uploadResults, deleteResults } = await updateFileArrayRequest(this.ticketDetail!.files, entity.files, {
        uploadFile: async (body, attachment) => {
          const file = await this.requestManager.createRequest({
            url: "/tickets/{ticketId}/upload",
            method: METHODS.POST,
            serverDataEntityDecoder: FileEntity,
          })({
            urlParams: { ticketId: entity.id },
            body,
            progressReceiver: attachment.setProgress,
          });
          attachment.setProgress(undefined);
          return file;
        },
        deleteFile: (fileId) =>
          this.requestManager.createRequest({
            url: "/tickets/{ticketId}/delete-file/{fileId}",
            method: METHODS.DELETE,
          })({
            urlParams: { ticketId: entity.id, fileId },
          }),
      });

      await this.reloadTicketAfterUpdate(entity);

      return { success: true, uploadResults, deleteResults } as const;
    } catch (error) {
      return { success: false, error: parseServerError(error) } as const;
    }
  };

  @action private reloadTicketAfterUpdate = async (entity: EditTicketEntity) => {
    const loadResult = await this.loadTicketDetail(entity.id);

    if (!loadResult.success) return;

    const ticketIndexInList = this.ticketsList.items.findIndex((ticket) => ticket.id === entity.id);
    if (ticketIndexInList !== -1) this.ticketsList.items.splice(ticketIndexInList, 1, loadResult.ticketDetail);

    for (const column of this.kanbanColumns) {
      const ticketIndexInColumn = column.tickets.findIndex((ticket) => ticket.id === entity.id);
      if (ticketIndexInColumn === -1) continue;
      column.updateTicketByIndex(ticketIndexInColumn, loadResult.ticketDetail);
      if (column.dictionary.key === loadResult.ticketDetail.status.key) break;
      column.removeTicketByValue(loadResult.ticketDetail);
      const newKanbanColumn = this.kanbanColumns.find(
        (column) => column.dictionary.key === loadResult.ticketDetail.status.key,
      );
      if (!newKanbanColumn) break;
      newKanbanColumn.addTicket(loadResult.ticketDetail, newKanbanColumn.tickets.length);
      break;
    }
  };

  @action updateTicketStatus = async (tickets: TicketEntity[], statusKey: string) => {
    try {
      await this.requestManager.createRequest({
        url: "/tickets/reorder",
        method: METHODS.POST,
      })({ body: { statusKey, ticketIds: tickets.map((ticket) => ticket.id) } });
      return { success: true } as const;
    } catch (error) {
      return { success: false, error: parseServerError(error) } as const;
    }
  };

  @action deleteTicket = async (ticketId: string) => {
    try {
      await this.requestManager.createRequest({
        url: "/tickets/{ticketId}",
        method: METHODS.DELETE,
      })({ urlParams: { ticketId } });

      this.removeTicketOnDelete(ticketId);

      return { success: true } as const;
    } catch (error) {
      return { success: false, error: parseServerError(error) } as const;
    }
  };

  @action private removeTicketOnDelete = (ticketId: string) => {
    const ticketIndexInList = this.ticketsList.items.findIndex((ticket) => ticket.id === ticketId);
    if (ticketIndexInList !== -1) this.ticketsList.items.splice(ticketIndexInList, 1);

    for (const column of this.kanbanColumns) {
      const ticketIndexInColumn = column.tickets.findIndex((ticket) => ticket.id === ticketId);
      if (ticketIndexInColumn === -1) continue;
      column.removeTicketByIndex(ticketIndexInColumn);
      break;
    }
  };
}
