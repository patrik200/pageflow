import { entityGetter, METHODS } from "@app/kit";
import { Inject, Service } from "typedi";
import { action, observable } from "mobx";
import { InternalRequestManager, parseServerError, Storage } from "@app/front-kit";

import { arrayOfTicketBoardEntitiesDecoder, TicketBoardEntity } from "core/entities/ticket/ticketBoard";
import { IdEntity } from "core/entities/id";
import { arrayOfPermissionEntitiesDecoder, PermissionEntity } from "core/entities/permission/permision";

import { ProfileStorage } from "core/storages/profile/profile";

import { EditTicketBoardEntity } from "./entities/EditTicketBoard";

@Service()
export class TicketBoardsStorage extends Storage {
  static token = "TicketBoardsStorage";

  constructor() {
    super();
    this.initStorage(TicketBoardsStorage.token);
  }

  @Inject() private requestManager!: InternalRequestManager;
  @Inject() private profileStorage!: ProfileStorage;

  @observable boards: TicketBoardEntity[] = [];

  @action loadTicketBoards = async ({ projectId }: { projectId: string | null }) => {
    try {
      const { array } = await this.requestManager.createRequest({
        url: "/ticket-boards",
        method: METHODS.GET,
        responseDataFieldPath: ["list"],
        serverDataEntityDecoder: arrayOfTicketBoardEntitiesDecoder,
      })({ body: { projectId } });
      array.forEach((board) => board.configure(this.profileStorage.user));

      this.boards = array;
      return { success: true } as const;
    } catch (error) {
      return { success: false, error: parseServerError(error) } as const;
    }
  };

  @action createTicketBoard = async (entity: EditTicketBoardEntity) => {
    try {
      const { id } = await this.requestManager.createRequest({
        url: "/ticket-boards",
        method: METHODS.POST,
        serverDataEntityDecoder: IdEntity,
      })({ body: entity.apiCreateReady });
      const board = entity.createTicketBoardEntity([PermissionEntity.buildOwner(this.profileStorage.user)], id);
      board.configure(this.profileStorage.user);

      this.boards.push(board);
      return { success: true, data: board } as const;
    } catch (error) {
      return { success: false, error: parseServerError(error) } as const;
    }
  };

  @action editTicketBoard = async (entity: EditTicketBoardEntity) => {
    const originalBoard = entityGetter(this.boards, entity.apiUpdateReady.url.id, "id");
    if (!originalBoard) return { success: false, error: false } as const;

    try {
      await this.requestManager.createRequest({
        url: "/ticket-boards/{id}",
        method: METHODS.PATCH,
      })({ body: entity.apiUpdateReady.body, urlParams: entity.apiUpdateReady.url });
      const board = entity.createTicketBoardEntity(originalBoard.entity.permissions);
      board.configure(this.profileStorage.user);
      this.boards[originalBoard.index] = board;
      return { success: true, data: board } as const;
    } catch (error) {
      return { success: false, error: parseServerError(error) } as const;
    }
  };

  @action deleteTicketBoard = async (boardId: string) => {
    const board = entityGetter(this.boards, boardId, "id");
    if (!board) return { success: false, error: false } as const;

    try {
      await this.requestManager.createRequest({
        url: "/ticket-boards/{id}",
        method: METHODS.DELETE,
      })({ urlParams: { id: boardId } });
      this.boards.splice(board.index, 1);
      return { success: true } as const;
    } catch (error) {
      return { success: false, error: parseServerError(error) } as const;
    }
  };

  @action loadPermissions = async (boardId: string) => {
    const board = entityGetter(this.boards, boardId, "id");
    if (!board) return { success: false, error: false } as const;

    try {
      const { array } = await this.requestManager.createRequest({
        url: "/ticket-boards/{id}/permissions",
        method: METHODS.GET,
        serverDataEntityDecoder: arrayOfPermissionEntitiesDecoder,
        responseDataFieldPath: ["list"],
      })({ urlParams: { id: boardId } });
      board.entity.permissions = array;
      return { success: true } as const;
    } catch (error) {
      return { success: false, error: parseServerError(error) } as const;
    }
  };

  @action createPermission = async (boardId: string, permission: PermissionEntity) => {
    const board = entityGetter(this.boards, boardId, "id");
    if (!board) return { success: false, error: false } as const;

    try {
      await this.requestManager.createRequest({
        url: "/ticket-boards/{id}/permissions",
        method: METHODS.POST,
      })({ urlParams: { id: boardId }, body: permission.apiReady });
      board.entity.permissions.push(permission);
      return { success: true } as const;
    } catch (error) {
      return { success: false, error: parseServerError(error) } as const;
    }
  };

  @action deletePermission = async (boardId: string, userId: string) => {
    const board = entityGetter(this.boards, boardId, "id");
    if (!board) return { success: false, error: false } as const;

    const permissionIndex = board.entity.permissions.findIndex((permission) => permission.user.id === userId);
    if (permissionIndex === -1) return { success: false, error: false } as const;

    try {
      await this.requestManager.createRequest({
        url: "/ticket-boards/{id}/permissions",
        method: METHODS.DELETE,
      })({ urlParams: { id: boardId }, body: { userId } });
      board.entity.permissions.splice(permissionIndex, 1);
      return { success: true } as const;
    } catch (error) {
      return { success: false, error: parseServerError(error) } as const;
    }
  };

  @action editPermission = async (boardId: string, entity: PermissionEntity) => {
    const board = entityGetter(this.boards, boardId, "id");
    if (!board) return { success: false, error: false } as const;

    const permissionIndex = board.entity.permissions.findIndex((permission) => permission.user.id === entity.user.id);
    if (permissionIndex === -1) return { success: false, error: false } as const;

    try {
      await this.requestManager.createRequest({
        url: "/ticket-boards/{id}/permissions",
        method: METHODS.PATCH,
      })({ urlParams: { id: boardId }, body: entity.apiReady });
      board.entity.permissions[permissionIndex] = entity;
      return { success: true } as const;
    } catch (error) {
      return { success: false, error: parseServerError(error) } as const;
    }
  };
}
