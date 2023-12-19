import { InternalRequestManager, parseServerError, Storage } from "@app/front-kit";
import { Inject, Service } from "typedi";
import { action, observable } from "mobx";
import { METHODS } from "@app/kit";

import { arrayOfTicketRelationEntitiesDecoder, TicketRelationEntity } from "core/entities/ticket/ticketRelation";

import { EditTicketRelationEntity } from "./entities/EditTicketRelation";

import { TicketsStorage as _TicketsStorageInject } from "./index";
import type { TicketsStorage as _TicketsStorageType } from "./index";

@Service()
export class TicketRelationsStorage extends Storage {
  static token = "TicketRelationsStorage";

  constructor() {
    super();
    this.initStorage(TicketRelationsStorage.token);
  }

  @Inject() private requestManager!: InternalRequestManager;
  @Inject(() => _TicketsStorageInject) ticketsStorageForList!: _TicketsStorageType;

  @observable ticketRelations: TicketRelationEntity[] = [];

  @action loadTicketRelations = async (
    ticketId: string,
    { loadOnlyAsMainRelated = false }: { loadOnlyAsMainRelated?: boolean } = {},
  ) => {
    try {
      const { array } = await this.requestManager.createRequest({
        url: "/tickets/{ticketId}/relations",
        method: METHODS.GET,
        responseDataFieldPath: ["list"],
        serverDataEntityDecoder: arrayOfTicketRelationEntitiesDecoder,
      })({ body: { onlyAsMainRelated: loadOnlyAsMainRelated }, urlParams: { ticketId } });

      this.ticketRelations = array;

      return { success: true, data: array } as const;
    } catch (error) {
      return { success: false, error: parseServerError(error) } as const;
    }
  };

  @action editTicketRelations = async (list: EditTicketRelationEntity[], mainTicketId: string) => {
    if (list.length === 0) return { success: true } as const;
    try {
      await this.requestManager.createRequest({
        url: "/tickets/{mainTicketId}/relations",
        method: METHODS.PATCH,
      })({
        body: { list: list.map((relation) => relation.apiReady) },
        urlParams: { mainTicketId },
      });
      return { success: true } as const;
    } catch (error) {
      return { success: false, error: parseServerError(error) } as const;
    }
  };
}
