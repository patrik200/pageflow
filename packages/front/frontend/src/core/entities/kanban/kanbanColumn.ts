import { observable, action } from "mobx";
import { Expose, Type } from "class-transformer";
import { BaseEntity, makeTransformableObject } from "@app/kit";
import { IsDefined, ValidateNested } from "class-validator";

import { TicketEntity } from "core/entities/ticket/ticket";
import { DictionaryValueEntity } from "core/entities/dictionary/dictionary";

export class TicketKanbanColumnEntity extends BaseEntity {
  static buildFromDictionaryValueEntity(dictionary: DictionaryValueEntity, tickets: TicketEntity[]) {
    return makeTransformableObject(TicketKanbanColumnEntity, () => ({
      dictionary,
      tickets: [...tickets],
    }));
  }

  constructor() {
    super();
    this.initEntity();
  }

  @observable @Expose() @IsDefined() @Type(() => DictionaryValueEntity) dictionary!: DictionaryValueEntity;

  @observable
  @Expose()
  @IsDefined()
  @Type(() => TicketEntity)
  @ValidateNested({ each: true })
  tickets!: TicketEntity[];

  removeTicketByValue = this.createDeleteByValue("tickets");
  removeTicketByIndex = this.createDeleteByIndex("tickets");
  updateTicketByIndex = this.createUpdateByIndex("tickets");

  @action addTicket = (ticket: TicketEntity, index: number) => {
    this.tickets.splice(index, 0, ticket);
  };
}
