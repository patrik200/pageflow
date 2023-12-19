import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOptionsWhere, IsNull, Repository, FindOptionsRelations } from "typeorm";
import { PermissionEntityType } from "@app/shared-enums";
import { FindManyOptions } from "typeorm/find-options/FindManyOptions";
import { isArray } from "@worksolutions/utils";

import { TicketBoardEntity } from "entities/TicketBoard";

import { getCurrentUser } from "modules/auth";
import { PermissionAccessService } from "modules/permissions";

import { GetTicketBoardIsFavouritesService } from "../favourite/get-is-favourite";

interface GetTicketBoardsListQueryOptions {
  projectId?: string | null;
}

@Injectable()
export class GetTicketBoardsListService {
  constructor(
    @InjectRepository(TicketBoardEntity) private ticketBoardsRepository: Repository<TicketBoardEntity>,
    private getTicketBoardIsFavouritesService: GetTicketBoardIsFavouritesService,
    @Inject(forwardRef(() => PermissionAccessService)) private permissionAccessService: PermissionAccessService,
  ) {}

  async getTicketBoardsList(
    query: GetTicketBoardsListQueryOptions,
    { loadFavourites, ...options }: { loadFavourites?: boolean; loadAuthor?: boolean; loadAuthorAvatar?: boolean } = {},
  ) {
    const commonRelations: FindOptionsRelations<TicketBoardEntity> = {
      author: options.loadAuthor
        ? {
            avatar: options.loadAuthorAvatar,
          }
        : false,
    };

    const commonFindOptions: FindOptionsWhere<TicketBoardEntity> = { client: { id: getCurrentUser().clientId } };
    if (query.projectId !== undefined) commonFindOptions.project = query.projectId ? { id: query.projectId } : IsNull();

    const [publicBoards, privateBoards] = await Promise.all([
      this.ticketBoardsRepository.find({
        where: { ...commonFindOptions, isPrivate: false },
        relations: commonRelations,
      }),
      this.ticketBoardsRepository
        .find({ where: { ...commonFindOptions, isPrivate: true }, relations: commonRelations })
        .then((boards) =>
          Promise.all(
            boards.map(async (board) => {
              const hasPermission = await this.permissionAccessService.validateToRead(
                { entityId: board.id, entityType: PermissionEntityType.TICKET_BOARD },
                false,
              );
              if (hasPermission) return board;
              return null!;
            }),
          ),
        )
        .then((board) => board.filter((board) => board !== null)),
    ]);

    const ticketBoards = [...publicBoards, ...privateBoards].sort((a, b) => (a.name > b.name ? 1 : -1));

    if (loadFavourites) {
      await Promise.all(
        ticketBoards.map((ticket) => this.getTicketBoardIsFavouritesService.loadTicketBoardIsFavouriteOrFail(ticket)),
      );
    }

    return ticketBoards;
  }

  async dangerGetTicketBoardsListByQuery(
    query: GetTicketBoardsListQueryOptions,
    options?: FindManyOptions<TicketBoardEntity>,
  ) {
    const findOptionsWhere: FindOptionsWhere<TicketBoardEntity> = {};
    if (query.projectId !== undefined) findOptionsWhere.project = query.projectId ? { id: query.projectId } : IsNull();

    if (options && isArray(options.where)) throw new Error("Array in where options is not supported");

    return await this.ticketBoardsRepository.find({
      ...options,
      where: {
        ...options?.where,
        ...findOptionsWhere,
      },
    });
  }
}
