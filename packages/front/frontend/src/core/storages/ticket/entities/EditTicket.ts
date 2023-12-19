import { BaseEntity } from "@app/kit";
import { computed, observable } from "mobx";
import { TicketPriorities } from "@app/shared-enums";
import { IsDefined, MinLength } from "class-validator";

import { NOT_EMPTY_VALIDATION } from "core/commonValidationErrors";

import { EditableFileEntity } from "core/entities/file";
import { TicketDetailEntity } from "core/entities/ticket/ticketDetail";

import { EditTicketRelationEntity } from "./EditTicketRelation";

export class EditTicketEntity extends BaseEntity {
  static buildEmpty(boardId: string) {
    return new EditTicketEntity(boardId);
  }

  static buildFromTicketEntity(ticket: TicketDetailEntity) {
    const editTicketEntity = new EditTicketEntity(ticket.author.id);
    editTicketEntity.id = ticket.id;
    editTicketEntity.slug = ticket.slug;
    editTicketEntity.setName(ticket.name);
    editTicketEntity.setStatus(ticket.status.key);
    editTicketEntity.setPriority(ticket.priority);
    editTicketEntity.setDeadlineAt(ticket.deadlineAt);
    editTicketEntity.setDescription(ticket.description);
    editTicketEntity.files = ticket.files.map((file) => file.toEditableFileEntity());
    if (ticket.type) editTicketEntity.setType(ticket.type.key);
    if (ticket.customer) editTicketEntity.setCustomer(ticket.customer.id);
    if (ticket.responsible) editTicketEntity.setResponsible(ticket.responsible.id);
    return editTicketEntity;
  }

  constructor(private boardId: string) {
    super();
    this.initEntity();
  }

  id = "";
  slug = "";

  @observable @MinLength(1, { message: NOT_EMPTY_VALIDATION }) name = "";
  setName = this.createSetter("name");

  @observable description = "";
  setDescription = this.createSetter("description");

  @observable customer: string | null = null;
  setCustomer = this.createSetter("customer");

  @observable responsible: string | null = null;
  setResponsible = this.createSetter("responsible");

  @observable deadlineAt: Date | null = null;
  setDeadlineAt = this.createSetter("deadlineAt");

  @observable priority: TicketPriorities | null = null;
  setPriority = this.createSetter("priority");

  @observable @IsDefined({ message: NOT_EMPTY_VALIDATION }) status: string | null = null;
  setStatus = this.createSetter("status");

  @observable type: string | null = null;
  setType = this.createSetter("type");

  @observable files: EditableFileEntity[] = [];
  addFiles = this.createPushArray("files");
  deleteFilesByIndex = this.createDeleteByIndex("files");

  @observable relations: EditTicketRelationEntity[] = [];
  addRelation = this.createPush("relations");
  setRelations = this.createSetter("relations");
  deleteRelationByIndex = this.createDeleteByIndex("relations");

  @computed get apiReady() {
    return {
      boardId: this.boardId,
      name: this.name,
      description: this.description || undefined,
      deadlineAt: this.deadlineAt,
      responsibleId: this.responsible,
      customerId: this.customer,
      priority: this.priority,
      statusKey: this.status,
      typeKey: this.type,
    };
  }
}
