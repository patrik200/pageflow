import { BaseEntity, createSortingForFieldGetter, createSortingSetter } from "@app/kit";
import type { Sorting } from "@app/kit";
import { computed, observable, action } from "mobx";
import { TicketSortingFields, TicketPriorities } from "@app/shared-enums";

import { filterChangeSubscriber } from "core/entities/_utils/filterChangeSubscriber";

export class LoadTicketsFilterEntity extends BaseEntity {
  static buildEmpty(boardId: string | undefined) {
    return new LoadTicketsFilterEntity(boardId);
  }

  constructor(private boardId: string | undefined) {
    super();
    this.initEntity();
    if (typeof window !== "undefined") this.setSorting(TicketSortingFields.CREATED_AT, "DESC");
  }

  @observable presentationType: "kanban" | "list" = "kanban";
  @action switchPresentationType = () => {
    this.presentationType = this.presentationType === "kanban" ? "list" : "kanban";
    this.setStatus(null);
  };

  @observable search = "";
  setSearch = this.createSetter("search");

  @observable searchInAttachments = false;
  setSearchInAttachments = this.createSetter("searchInAttachments");

  @observable showArchived = false;
  setShowArchived = this.createSetter("showArchived");

  @observable author: string | null = null;
  setAuthor = this.createSetter("author");

  @observable customer: string | null = null;
  setCustomer = this.createSetter("customer");

  @observable responsible: string | null = null;
  setResponsible = this.createSetter("responsible");

  @observable priority: TicketPriorities | null = null;
  setPriority = this.createSetter("priority");

  @observable type: string | null = null;
  setType = this.createSetter("type");

  @observable status: string | null = null;
  @action setStatus = (status: string | null) => {
    if (status === "archived") this.setShowArchived(true);
    else if (status !== null) this.setShowArchived(false);
    this.status = status;
  };

  @observable sorting?: Sorting<TicketSortingFields> = undefined;
  getSortingForField = createSortingForFieldGetter<TicketSortingFields>(this);
  setSorting = createSortingSetter<TicketSortingFields>(this);

  subscribeOnChange(callback: () => void) {
    return filterChangeSubscriber(
      {
        search: ["search"],
        checkboxes: ["searchInAttachments", "showArchived"],
        selects: ["author", "customer", "responsible", "priority", "type", "status"],
        sorting: "sorting",
      },
      this,
      callback,
    );
  }

  @computed get apiReady() {
    return {
      boardId: this.boardId,
      search: this.search,
      searchInAttachments: this.searchInAttachments,
      excludeArchived: !this.showArchived,
      authorId: this.author,
      customerId: this.customer,
      responsibleId: this.responsible,
      priority: this.priority,
      typeKey: this.type,
      statusKey: this.status,
      sorting: this.sorting,
    };
  }
}
