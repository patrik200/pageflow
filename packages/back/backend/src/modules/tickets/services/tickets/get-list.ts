import { DictionaryTypes, PermissionEntityType, TicketPriorities, TicketSortingFields } from "@app/shared-enums";
import type { Sorting } from "@app/kit";
import { PaginationQueryInterface } from "@app/kit";
import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindManyOptions, In, Repository } from "typeorm";
import { convertSortingToElasticSearch, ElasticService, injectPaginationToFindAndCountResult } from "@app/back-kit";
import { isNil } from "@worksolutions/utils";
import { QueryDslQueryContainer } from "@elastic/elasticsearch/lib/api/types";

import { TicketEntity } from "entities/Ticket";

import { PermissionAccessService } from "modules/permissions";
import { GetDictionaryValueService, GetDictionaryValuesListService } from "modules/dictionary";
import { getCurrentUser } from "modules/auth";
import { GetUserService } from "modules/users";

import { GetTicketIsFavouritesService } from "../favourite/get-is-favourite";
import { TicketBoardEntity } from "../../../../entities/TicketBoard";

interface GetTicketsListQueryOptions {
  boardId: string | null;
  pagination: PaginationQueryInterface | null;
  search?: string;
  searchInAttachments: boolean;
  sorting: Sorting<TicketSortingFields>;
  authorId?: string;
  responsibleId?: string;
  customerId?: string;
  priority?: TicketPriorities;
  typeKey?: string;
  statusKey?: string;
  excludeArchived?: boolean;
}

@Injectable()
export class GetTicketsListService {
  constructor(
    @InjectRepository(TicketEntity) private ticketsRepository: Repository<TicketEntity>,
    private getTicketIsFavouritesService: GetTicketIsFavouritesService,
    @Inject(forwardRef(() => PermissionAccessService)) private permissionAccessService: PermissionAccessService,
    @Inject(forwardRef(() => GetDictionaryValueService)) private getDictionaryValueService: GetDictionaryValueService,
    @Inject(forwardRef(() => GetUserService)) private getUserService: GetUserService,
    @Inject(forwardRef(() => GetDictionaryValuesListService))
    private getDictionaryValuesListService: GetDictionaryValuesListService,
    private elasticService: ElasticService,
  ) {}

  private getHasSearch(searchParams: GetTicketsListQueryOptions) {
    return !isNil(searchParams.search) && searchParams.search !== "";
  }

  private async injectPriorityToElasticQuery(
    searchParams: GetTicketsListQueryOptions,
    query: QueryDslQueryContainer[],
  ) {
    if (!searchParams.priority) return;
    query.push({ term: { priority: Object.values(TicketPriorities).indexOf(searchParams.priority) } });
  }

  private async injectAuthorToElasticQuery(searchParams: GetTicketsListQueryOptions, query: QueryDslQueryContainer[]) {
    if (!searchParams.authorId) return;
    const author = await this.getUserService.getUserOrFail(searchParams.authorId, "id");
    query.push({ term: { authorId: author.id } });
  }

  private async injectCustomerToElasticQuery(
    searchParams: GetTicketsListQueryOptions,
    query: QueryDslQueryContainer[],
  ) {
    if (!searchParams.customerId) return;
    const customer = await this.getUserService.getUserOrFail(searchParams.customerId, "id");
    query.push({ term: { customerId: customer.id } });
  }

  private async injectResponsibleToElasticQuery(
    searchParams: GetTicketsListQueryOptions,
    query: QueryDslQueryContainer[],
  ) {
    if (!searchParams.responsibleId) return;
    const responsible = await this.getUserService.getUserOrFail(searchParams.responsibleId, "id");
    query.push({ term: { responsibleId: responsible.id } });
  }

  private async injectTypeToElasticQuery(searchParams: GetTicketsListQueryOptions, query: QueryDslQueryContainer[]) {
    if (!searchParams.typeKey) return;
    const type = await this.getDictionaryValueService.getDictionaryValueOrFail(
      searchParams.typeKey,
      DictionaryTypes.TICKET_TYPE,
    );
    query.push({ term: { typeId: type.id } });
  }

  private async injectStatusesToElasticQuery(
    searchParams: GetTicketsListQueryOptions,
    query: QueryDslQueryContainer[],
  ) {
    if (searchParams.statusKey) {
      const status = await this.getDictionaryValueService.getDictionaryValueOrFail(
        searchParams.statusKey,
        DictionaryTypes.TICKET_STATUS,
      );
      query.push({ term: { statusId: status.id } });
      return;
    }

    if (!searchParams.excludeArchived) return;

    const ticketStatuses = await this.getDictionaryValuesListService.getDictionaryValuesListOrFail(
      DictionaryTypes.TICKET_STATUS,
    );

    const archivedStatusIndex = ticketStatuses.findIndex((ticketStatus) => ticketStatus.key === "archived");
    if (archivedStatusIndex !== -1) ticketStatuses.splice(archivedStatusIndex, 1);

    query.push({ terms: { statusId: ticketStatuses.map((status) => status.id) } });
  }

  private async injectSearchToElasticQuery(searchParams: GetTicketsListQueryOptions, query: QueryDslQueryContainer[]) {
    if (!this.getHasSearch(searchParams)) return;

    const search = searchParams.search!.trim();

    query.push({
      bool: {
        should: [
          {
            multi_match: {
              query: search,
              fields: [
                "name",
                "description",
                ...(searchParams.searchInAttachments ? ["attachments.attachment.content"] : []),
              ],
              fuzziness: "AUTO",
            },
          },
          {
            query_string: {
              query: `*${search}*`,
              fields: ["slug"],
              minimum_should_match: search.length,
            },
          },
        ],
      },
    });
  }

  private async getElasticQuery(searchParams: GetTicketsListQueryOptions): Promise<{ query: QueryDslQueryContainer }> {
    const mustQuery: QueryDslQueryContainer[] = [{ term: { clientId: getCurrentUser().clientId } }];
    if (searchParams.boardId) mustQuery.push({ term: { boardId: searchParams.boardId } });

    await Promise.all([
      this.injectPriorityToElasticQuery(searchParams, mustQuery),
      this.injectAuthorToElasticQuery(searchParams, mustQuery),
      this.injectCustomerToElasticQuery(searchParams, mustQuery),
      this.injectResponsibleToElasticQuery(searchParams, mustQuery),
      this.injectTypeToElasticQuery(searchParams, mustQuery),
      this.injectStatusesToElasticQuery(searchParams, mustQuery),
      this.injectSearchToElasticQuery(searchParams, mustQuery),
    ]);

    return { query: { bool: { must: mustQuery } } };
  }

  private async searchTicketsInElastic(searchParams: GetTicketsListQueryOptions) {
    const query = await this.getElasticQuery(searchParams);

    const response = await this.elasticService.searchQueryMatchOrFail<{ boardId: string }>("tickets", query, {
      pagination: searchParams.pagination ?? undefined,
      sorting: convertSortingToElasticSearch(searchParams.sorting),
    });

    return {
      total: response.total,
      hits: response.hits.map(({ _id, _source }) => ({ ticketId: _id, boardId: _source.boardId })),
    };
  }

  async getTicketsListOrFail(
    query: GetTicketsListQueryOptions,
    {
      loadFavourites,
      ...options
    }: {
      loadFavourites?: boolean;
      loadResponsible?: boolean;
      loadResponsibleAvatar?: boolean;
      loadCustomer?: boolean;
      loadCustomerAvatar?: boolean;
      loadFiles?: boolean;
      loadType?: boolean;
      loadStatus?: boolean;
    } = {},
  ) {
    if (query.boardId)
      await this.permissionAccessService.validateToRead(
        { entityId: query.boardId, entityType: PermissionEntityType.TICKET_BOARD },
        true,
      );

    const { hits, total } = await this.searchTicketsInElastic(query);

    const rawTicketsBySearchHitIds = await this.ticketsRepository.find({
      where: { id: In(hits.map((hit) => hit.ticketId)) },
      relations: {
        responsible: options.loadResponsible
          ? {
              avatar: options.loadResponsibleAvatar,
            }
          : false,
        customer: options.loadCustomer
          ? {
              avatar: options.loadCustomerAvatar,
            }
          : false,
        files: options.loadFiles
          ? {
              file: true,
            }
          : false,
        type: options.loadType,
        status: options.loadStatus,
      },
    });

    const foundTickets = hits.map((hit) => {
      const ticket = rawTicketsBySearchHitIds.find((ticket) => ticket.id === hit.ticketId)!;
      ticket.board = { id: hit.boardId } as TicketBoardEntity;
      return ticket;
    });

    const filteredTicketsByPermissions = query.boardId
      ? foundTickets
      : (
          await Promise.all(
            foundTickets.map(async (ticket) => {
              const hasAccess = await this.permissionAccessService.validateToRead(
                { entityId: ticket.board.id, entityType: PermissionEntityType.TICKET_BOARD },
                false,
              );
              if (!hasAccess) return undefined!;
              return ticket;
            }),
          )
        ).filter(Boolean);

    await Promise.all([
      loadFavourites &&
        Promise.all(
          filteredTicketsByPermissions.map((ticket) => this.getTicketIsFavouritesService.loadTicketIsFavourite(ticket)),
        ),
    ]);

    if (query.pagination !== null)
      return injectPaginationToFindAndCountResult(query.pagination, [
        foundTickets,
        total - (foundTickets.length - filteredTicketsByPermissions.length),
      ]);

    return foundTickets;
  }

  async dangerGetTicketsList(findOptions: FindManyOptions<TicketEntity>) {
    return await this.ticketsRepository.find(findOptions);
  }
}
