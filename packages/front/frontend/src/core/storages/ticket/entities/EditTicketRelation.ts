import { computed, observable } from "mobx";
import { BaseEntity, makeTransformableObject } from "@app/kit";
import { TicketRelationTypes } from "@app/shared-enums";
import { IsDefined } from "class-validator";

import { NOT_EMPTY_VALIDATION } from "core/commonValidationErrors";

import { TicketRelationEntity } from "core/entities/ticket/ticketRelation";

export class EditTicketRelationEntity extends BaseEntity {
  static buildEmpty() {
    return makeTransformableObject(EditTicketRelationEntity);
  }

  static buildFromTicketRelation(entity: TicketRelationEntity) {
    return makeTransformableObject(EditTicketRelationEntity, () => ({
      relatedTicketId: entity.relatedTicket.id,
      type: entity.type,
    }));
  }

  constructor() {
    super();
    this.initEntity();
  }

  @observable @IsDefined({ message: NOT_EMPTY_VALIDATION }) relatedTicketId: string | null = null;
  setRelatedTicketId = this.createSetter("relatedTicketId");

  @observable type: TicketRelationTypes = TicketRelationTypes.DEPENDENCY;
  setType = this.createSetter("type");

  @computed get apiReady() {
    return {
      relatedTicketId: this.relatedTicketId,
      type: this.type,
    };
  }
}
